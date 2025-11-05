import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { z } from "zod";

import {
  AuthenticationRequiredError,
  IncompleteProfileError,
  requireUserProfile
} from "@/lib/auth/require-user-profile";
import { getParticipantById } from "@/lib/repos/participants";
import {
  createPaymentRecord,
  getActivePaymentForParticipant
} from "@/lib/repos/payments";
import { getHackathonById } from "@/lib/repos/hackathons";
import { getCashfreeClient } from "@/lib/payments/cashfree";
import { updateParticipantPaymentStatus } from "@/lib/repos/participants";
import { AppError } from "@/lib/errors/app-error";
import { dispatchNotification } from "@/lib/notifications";

const requestSchema = z.object({
  participantId: z.string().uuid(),
  returnUrl: z.string().url().optional(),
  notifyUrl: z.string().url().optional()
});

function handleKnownError(error: unknown) {
  if (
    error instanceof AuthenticationRequiredError ||
    error instanceof IncompleteProfileError
  ) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: error.message },
      { status: 401 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
        details: error.details
      },
      { status: error.status }
    );
  }

  console.error("Cashfree order creation failed:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "Unable to initiate payment. Please try again."
    },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  let body: z.infer<typeof requestSchema>;

  try {
    body = requestSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        error: "BAD_REQUEST",
        message: "Invalid request payload.",
        details: error instanceof Error ? error.message : error
      },
      { status: 400 }
    );
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      throw new AuthenticationRequiredError();
    }

    const { profile } = await requireUserProfile({
      requireCompleteProfile: true
    });

    const participant = await getParticipantById(body.participantId);

    if (participant.user_id !== profile.id) {
      return NextResponse.json(
        {
          error: "FORBIDDEN",
          message: "You are not allowed to initiate payment for this registration."
        },
        { status: 403 }
      );
    }

    if (participant.payment_status === "paid") {
      return NextResponse.json(
        {
          error: "ALREADY_PAID",
          message: "Payment for this registration has already been completed."
        },
        { status: 409 }
      );
    }

    const hackathon = await getHackathonById(participant.hackathon_id);

    const amount = Number(hackathon.participation_fee ?? 0);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          error: "NO_PAYMENT_REQUIRED",
          message:
            "This hackathon does not require a payment. Please contact support if you believe this is incorrect."
        },
        { status: 400 }
      );
    }

    const existingPayment = await getActivePaymentForParticipant(
      participant.id
    );

    if (
      existingPayment &&
      existingPayment.gateway_response &&
      typeof existingPayment.gateway_response === "object"
    ) {
      const sessionId =
        (existingPayment.gateway_response as Record<string, unknown>)
          ?.payment_session_id;
      if (sessionId && typeof sessionId === "string") {
        return NextResponse.json({
          data: {
            orderId: existingPayment.order_id,
            paymentSessionId: sessionId,
            amount
          }
        });
      }
    }

    const orderId = `order_${participant.id.slice(0, 8)}_${Date.now()}`;
    const client = getCashfreeClient();

    const defaultReturnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/payments/cashfree/return?order_id={order_id}`;
    const defaultNotifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/webhooks/cashfree`;

    const orderRequest = {
      order_id: orderId,
      order_amount: Number(amount.toFixed(2)),
      order_currency: "INR",
      order_note: `Registration fee for ${hackathon.title}`,
      customer_details: {
        customer_id: profile.user_id,
        customer_email: profile.email,
        customer_phone: profile.phone ?? ""
      },
      order_meta: {
        return_url: body.returnUrl ?? defaultReturnUrl,
        notify_url: body.notifyUrl ?? defaultNotifyUrl
      }
    };

    const orderResponse = await client.PGCreateOrder(orderRequest, undefined, orderId);
    const orderData = orderResponse.data ?? {};

    const paymentSessionId =
      (orderData as Record<string, unknown>).payment_session_id;

    if (!paymentSessionId || typeof paymentSessionId !== "string") {
      throw new Error("Cashfree response missing payment_session_id.");
    }

    await createPaymentRecord({
      orderId,
      participantId: participant.id,
      hackathonId: hackathon.id,
      userId: profile.id,
      amount,
      currency: "INR",
      paymentGateway: "Cashfree",
      customerEmail: profile.email ?? undefined,
      customerPhone: profile.phone ?? undefined,
      orderNote: `Registration fee for ${hackathon.title}`,
      returnUrl: orderRequest.order_meta?.return_url ?? undefined,
      notifyUrl: orderRequest.order_meta?.notify_url ?? undefined,
      gatewayResponse: {
        cf_order_id: (orderData as Record<string, unknown>).cf_order_id,
        payment_session_id: paymentSessionId,
        order_status: (orderData as Record<string, unknown>).order_status
      }
    });

    await updateParticipantPaymentStatus({
      participantId: participant.id,
      paymentStatus: "pending",
      paymentId: undefined
    });

    try {
      await dispatchNotification({
        userId: profile.id,
        template: "payment_session_created",
        data: {
          hackathonTitle: hackathon.title,
          amount,
          orderId,
          paymentSessionId
        }
      });
    } catch (notificationError) {
      console.error(
        "Failed to send payment session notification:",
        notificationError
      );
    }

    return NextResponse.json({
      data: {
        orderId,
        paymentSessionId,
        amount
      }
    });
  } catch (error) {
    return handleKnownError(error);
  }
}
