import { NextResponse } from "next/server";
import { z } from "zod";

import { getCashfreeClient } from "@/lib/payments/cashfree";
import { getHackathonById } from "@/lib/repos/hackathons";
import {
  getPaymentByOrderId,
  updatePaymentFromGateway
} from "@/lib/repos/payments";
import { updateParticipantPaymentStatus } from "@/lib/repos/participants";
import { AppError } from "@/lib/errors/app-error";
import { dispatchNotification } from "@/lib/notifications";

const verifySchema = z.object({
  orderId: z.string().trim().min(1, { message: "Order id is required." })
});

function normaliseStatus(raw: unknown) {
  const value = typeof raw === "string" ? raw.toLowerCase() : "";
  if (value === "paid" || value === "success") return "success" as const;
  if (value === "failed" || value === "cancelled") return "failed" as const;
  if (value === "refunded") return "refunded" as const;
  return "pending" as const;
}

function handleError(error: unknown) {
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

  console.error("Cashfree verification failed:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "Unable to verify payment status. Please try again."
    },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  let body: z.infer<typeof verifySchema>;

  try {
    body = verifySchema.parse(await request.json());
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
    const client = getCashfreeClient();
    const orderResponse = await client.PGFetchOrder(body.orderId);
    const orderData =
      (orderResponse.data as unknown as Record<string, unknown>) ?? {};

    const orderStatus = normaliseStatus(
      orderData?.order_status ?? orderData?.status
    );

    const paymentsRaw = orderData["payments"] as unknown;
    const primaryPayment = Array.isArray(paymentsRaw) ? paymentsRaw[0] : undefined;
    const rawPaymentId =
      (primaryPayment as Record<string, unknown>)?.payment_id ??
      (primaryPayment as Record<string, unknown>)?.cf_payment_id;
    const paymentId =
      typeof rawPaymentId === "string" && rawPaymentId.trim().length > 0
        ? rawPaymentId
        : body.orderId;

    await updatePaymentFromGateway({
      orderId: body.orderId,
      paymentId,
      status:
        orderStatus === "success"
          ? "success"
          : orderStatus === "failed"
            ? "failed"
            : orderStatus === "refunded"
              ? "refunded"
              : "pending",
      gatewayResponse: orderData
    });

    const paymentRecord = await getPaymentByOrderId(body.orderId);

    if (paymentRecord) {
      if (orderStatus === "success") {
        await updateParticipantPaymentStatus({
          participantId: paymentRecord.participant_id,
          paymentStatus: "paid",
          paymentId
        });
      } else if (orderStatus === "failed") {
        await updateParticipantPaymentStatus({
          participantId: paymentRecord.participant_id,
          paymentStatus: "failed",
          paymentId
        });
      } else if (orderStatus === "refunded") {
        await updateParticipantPaymentStatus({
          participantId: paymentRecord.participant_id,
          paymentStatus: "refunded",
          paymentId
        });
      }

      const templateKey =
        orderStatus === "success"
          ? "payment_success"
          : orderStatus === "failed"
            ? "payment_failed"
            : orderStatus === "refunded"
              ? "payment_refunded"
              : null;

      if (templateKey && paymentRecord.user_id) {
        try {
          const hackathon = await getHackathonById(
            paymentRecord.hackathon_id
          );
          await dispatchNotification({
            userId: paymentRecord.user_id,
            template: templateKey,
            data: {
              hackathonTitle: hackathon.title,
              amount: paymentRecord.amount,
              orderId: body.orderId
            }
          });
        } catch (notificationError) {
          console.error(
            "Failed to send payment status notification:",
            notificationError
          );
        }
      }
    }

    return NextResponse.json({
      data: {
        orderStatus,
        paymentStatus: orderStatus,
        paymentId
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
