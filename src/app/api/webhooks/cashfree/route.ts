import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

import { AppError } from "@/lib/errors/app-error";
import { getHackathonById } from "@/lib/repos/hackathons";
import { dispatchNotification } from "@/lib/notifications";
import {
  getPaymentByOrderId,
  updatePaymentFromGateway
} from "@/lib/repos/payments";
import { updateParticipantPaymentStatus } from "@/lib/repos/participants";

const SIGNATURE_HEADER = "x-webhook-signature";
const TIMESTAMP_HEADER = "x-webhook-timestamp";

function normaliseStatus(value: unknown) {
  const status = typeof value === "string" ? value.toLowerCase() : "";
  if (status === "paid" || status === "success") return "success" as const;
  if (status === "failed" || status === "cancelled") return "failed" as const;
  if (status === "refunded") return "refunded" as const;
  return "pending" as const;
}

async function updateEntities(orderId: string, payload: Record<string, unknown>) {
  const orderStatus = normaliseStatus(payload["order_status"] ?? payload["status"]);

  const paymentsRaw = payload["payments"] as unknown;
  const primaryPayment = Array.isArray(paymentsRaw) ? paymentsRaw[0] : undefined;
  const rawPaymentId =
    (primaryPayment as Record<string, unknown>)?.payment_id ??
    (primaryPayment as Record<string, unknown>)?.cf_payment_id;
  const paymentId =
    typeof rawPaymentId === "string" && rawPaymentId.trim().length > 0
      ? rawPaymentId
      : orderId;

  await updatePaymentFromGateway({
    orderId,
    paymentId,
    status:
      orderStatus === "success"
        ? "success"
        : orderStatus === "failed"
          ? "failed"
          : orderStatus === "refunded"
            ? "refunded"
            : "pending",
    gatewayResponse: payload
  });

  const paymentRecord = await getPaymentByOrderId(orderId);

  if (!paymentRecord) {
    return;
  }

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
      const hackathon = await getHackathonById(paymentRecord.hackathon_id);
      await dispatchNotification({
        userId: paymentRecord.user_id,
        template: templateKey,
        data: {
          hackathonTitle: hackathon.title,
          amount: paymentRecord.amount,
          orderId
        }
      });
    } catch (notificationError) {
      console.error(
        "Failed to send webhook payment notification:",
        notificationError
      );
    }
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.CASHFREE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      {
        error: "SERVER_MISCONFIGURED",
        message: "Missing CASHFREE_WEBHOOK_SECRET environment variable."
      },
      { status: 500 }
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER);
  const timestamp = request.headers.get(TIMESTAMP_HEADER);

  if (!signature || !timestamp) {
    return NextResponse.json(
      {
        error: "BAD_REQUEST",
        message: "Missing Cashfree signature headers."
      },
      { status: 400 }
    );
  }

  const rawBody = await request.text();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Invalid webhook signature."
      },
      { status: 401 }
    );
  }

  try {
    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    const orderId = payload?.order_id as string | undefined;

    if (!orderId) {
      throw new AppError("Webhook missing order_id.", {
        code: "BAD_REQUEST",
        status: 400
      });
    }

    await updateEntities(orderId, payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: error.status }
      );
    }

    console.error("Cashfree webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

