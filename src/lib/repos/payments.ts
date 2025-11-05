import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  paymentInitiationSchema,
  paymentVerificationSchema,
  paymentRefundSchema,
  type PaymentInitiationInput,
  type PaymentVerificationInput,
  type PaymentRefundInput
} from "@/lib/validation/payments";
import {
  AppError,
  ensureSupabaseData,
  mapSupabaseError
} from "@/lib/errors/app-error";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { Payment } from "@/types/database";

const PAYMENT_SELECT_COLUMNS =
  "id,user_id,hackathon_id,participant_id,order_id,payment_id,amount,currency,status,payment_method,payment_gateway,gateway_response,refund_id,refund_amount,created_at,updated_at";

function normaliseAmount(amount: number) {
  return Math.round(amount * 100) / 100;
}

export async function createPaymentRecord(
  input: PaymentInitiationInput,
  client?: SupabaseClient
) {
  const payload = paymentInitiationSchema.parse(input);
  const supabase = client ?? createServiceRoleClient();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: payload.orderId,
      participant_id: payload.participantId,
      hackathon_id: payload.hackathonId,
      user_id: payload.userId ?? null,
      amount: normaliseAmount(payload.amount),
      currency: payload.currency,
      status: "initiated",
      payment_gateway: payload.paymentGateway,
      gateway_response: payload.gatewayResponse ?? null
    })
    .select(PAYMENT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw mapSupabaseError(error, "Failed to create payment record.");
  }

  return ensureSupabaseData(
    { data, error: null },
    { notFoundMessage: "Unable to create payment record." }
  ) as Payment;
}

export async function setPaymentPending(
  orderId: string,
  client?: SupabaseClient
) {
  const id = z.string().trim().min(1).parse(orderId);
  const supabase = client ?? createServiceRoleClient();

  const { data, error } = await supabase
    .from("payments")
    .update({
      status: "pending",
      updated_at: new Date().toISOString()
    })
    .eq("order_id", id)
    .select(PAYMENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to update payment status.");
  }

  if (!data) {
    throw new AppError("Payment record not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Payment;
}

export async function updatePaymentFromGateway(
  input: PaymentVerificationInput,
  client?: SupabaseClient
) {
  const payload = paymentVerificationSchema.parse(input);
  const supabase = client ?? createServiceRoleClient();

  const { data, error } = await supabase
    .from("payments")
    .update({
      payment_id: payload.paymentId,
      status: payload.status,
      gateway_response: payload.gatewayResponse ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("order_id", payload.orderId)
    .select(PAYMENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to update payment record.");
  }

  if (!data) {
    throw new AppError("Payment record not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Payment;
}

export async function recordPaymentRefund(
  input: PaymentRefundInput,
  client?: SupabaseClient
) {
  const payload = paymentRefundSchema.parse(input);
  const supabase = client ?? createServiceRoleClient();

  if (!payload.paymentId) {
    throw new AppError("Payment id is required to record a refund.", {
      code: "BAD_REQUEST",
      status: 400
    });
  }

  const { data, error } = await supabase
    .from("payments")
    .update({
      status: "refunded",
      refund_amount: normaliseAmount(payload.amount),
      refund_id: payload.refundId ?? null,
      gateway_response: payload.reason
        ? { reason: payload.reason }
        : null,
      updated_at: new Date().toISOString()
    })
    .eq("payment_id", payload.paymentId)
    .select(PAYMENT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to record payment refund.");
  }

  if (!data) {
    throw new AppError("Payment record not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Payment;
}

export async function getPaymentByOrderId(
  orderId: string,
  client?: SupabaseClient
) {
  const id = z.string().trim().min(1).parse(orderId);
  const supabase = client ?? createServiceRoleClient();

  const { data, error } = await supabase
    .from("payments")
    .select(PAYMENT_SELECT_COLUMNS)
    .eq("order_id", id)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch payment.");
  }

  return data as Payment | null;
}

export async function getActivePaymentForParticipant(
  participantId: string,
  client?: SupabaseClient
) {
  const supabase = client ?? createServiceRoleClient();
  const id = z.string().uuid().parse(participantId);

  const { data, error } = await supabase
    .from("payments")
    .select(PAYMENT_SELECT_COLUMNS)
    .eq("participant_id", id)
    .in("status", ["initiated", "pending"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch payment.");
  }

  return data as Payment | null;
}
