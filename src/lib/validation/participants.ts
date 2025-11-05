import { z } from "zod";

import {
  emailSchema,
  optionalTrimmedString,
  uuidSchema
} from "./shared";

const teamMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Team member name is required." })
    .max(120, { message: "Team member name is too long." }),
  email: emailSchema.optional(),
  role: optionalTrimmedString({ max: 80 })
});

export const participantRegistrationSchema = z.object({
  hackathonId: uuidSchema,
  userId: uuidSchema,
  teamName: optionalTrimmedString({ max: 120 }),
  teamMembers: z.array(teamMemberSchema).max(10).optional()
});

export const participantSubmissionSchema = z.object({
  participantId: uuidSchema,
  submissionUrl: z
    .string()
    .trim()
    .url({ message: "Please provide a valid submission URL." }),
  submissionDescription: optionalTrimmedString({ max: 2000 })
});

export const paymentStatusSchema = z.object({
  participantId: uuidSchema,
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  paymentId: optionalTrimmedString({ max: 120 }),
  gatewayResponse: z.any().optional()
});

export type ParticipantRegistrationInput = z.infer<
  typeof participantRegistrationSchema
>;
export type ParticipantSubmissionInput = z.infer<
  typeof participantSubmissionSchema
>;
export type ParticipantPaymentStatusInput = z.infer<
  typeof paymentStatusSchema
>;
