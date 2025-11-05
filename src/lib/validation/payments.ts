import { z } from "zod";

import {
  monetaryAmountSchema,
  optionalTrimmedString,
  uuidSchema
} from "./shared";

export const paymentInitiationSchema = z
  .object({
    orderId: z
      .string()
      .trim()
      .min(1, { message: "Order id is required." })
      .max(120, { message: "Order id must not exceed 120 characters." }),
    participantId: uuidSchema,
    hackathonId: uuidSchema,
    userId: uuidSchema.optional(),
    amount: monetaryAmountSchema,
    currency: z.enum(["INR"]).default("INR"),
    paymentGateway: z.literal("Cashfree").default("Cashfree"),
    customerEmail: z.string().trim().email().optional(),
    customerPhone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, {
        message: "Please provide a valid 10 digit phone number."
      })
      .optional(),
    returnUrl: z.string().trim().url().optional(),
    notifyUrl: z.string().trim().url().optional(),
    orderNote: z.string().trim().max(255).optional(),
    gatewayResponse: z.record(z.string(), z.unknown()).optional()
  })
  .refine((data) => data.amount > 0, {
    path: ["amount"],
    message: "Amount must be greater than zero."
  });

export const paymentVerificationSchema = z.object({
  orderId: z
    .string()
    .trim()
    .min(1, { message: "Order id is required." })
    .max(120),
  paymentId: z
    .string()
    .trim()
    .min(1, { message: "Payment id is required." })
    .max(120),
  status: z.enum(["initiated", "pending", "success", "failed", "refunded"]),
  gatewayResponse: z.record(z.string(), z.unknown()).optional()
});

export const paymentRefundSchema = z.object({
  paymentId: optionalTrimmedString({ min: 1, max: 120 }),
  refundId: optionalTrimmedString({ max: 120 }),
  amount: monetaryAmountSchema,
  reason: optionalTrimmedString({ max: 240 })
});

export type PaymentInitiationInput = z.infer<typeof paymentInitiationSchema>;
export type PaymentVerificationInput = z.infer<typeof paymentVerificationSchema>;
export type PaymentRefundInput = z.infer<typeof paymentRefundSchema>;
