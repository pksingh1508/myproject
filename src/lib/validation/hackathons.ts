import { z } from "zod";

import {
  isoDateTimeSchema,
  monetaryAmountSchema,
  nonNegativeIntegerSchema,
  positiveIntegerSchema,
  uuidSchema
} from "./shared";

const statusSchema = z.enum([
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled"
]);

const optionalText = z
  .string()
  .trim()
  .min(1)
  .optional()
  .transform((value) => (value && value.length ? value : undefined));

const optionalBoundedText = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .optional()
    .transform((value) => (value && value.length ? value : undefined));

const optionalUrl = z
  .string()
  .trim()
  .url({ message: "Please provide a valid URL." })
  .optional()
  .transform((value) => (value && value.length ? value : undefined));

const baseHackathonSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, { message: "Title must be at least 3 characters long." })
      .max(150, { message: "Title must not exceed 150 characters." }),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug can only contain lowercase letters, numbers, and single hyphen separators."
      })
      .min(3, { message: "Slug must be at least 3 characters long." })
      .max(80, { message: "Slug must not exceed 80 characters." }),
    description: z
      .string()
      .trim()
      .min(20, { message: "Description must be at least 20 characters long." }),
    short_description: optionalBoundedText(280),
    banner_url: optionalUrl,
    location_type: z.enum(["online", "offline", "hybrid"]),
    location_details: optionalBoundedText(280),
    venue_address: optionalBoundedText(280),
    start_date: isoDateTimeSchema,
    end_date: isoDateTimeSchema,
    registration_start: isoDateTimeSchema,
    registration_end: isoDateTimeSchema,
    prize_pool: nonNegativeIntegerSchema,
    first_prize: nonNegativeIntegerSchema.optional(),
    second_prize: nonNegativeIntegerSchema.optional(),
    third_prize: nonNegativeIntegerSchema.optional(),
    participation_fee: monetaryAmountSchema,
    max_participants: positiveIntegerSchema.nullable().optional(),
    min_team_size: positiveIntegerSchema.default(1),
    max_team_size: positiveIntegerSchema.default(4),
    status: statusSchema.default("draft"),
    themes: z
      .array(
        z.string().trim().min(1, { message: "Theme names must not be empty." })
      )
      .max(10, { message: "A maximum of 10 themes can be provided." })
      .optional(),
    requirements: optionalText,
    rules: optionalText
  })
  .refine(
    (data) =>
      new Date(data.registration_start) <= new Date(data.registration_end),
    {
      path: ["registration_end"],
      message: "Registration end must be after registration start."
    }
  )
  .refine(
    (data) => new Date(data.start_date) >= new Date(data.registration_end),
    {
      path: ["start_date"],
      message: "Hackathon cannot start before registration is complete."
    }
  )
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    path: ["end_date"],
    message: "Hackathon end date must be after the start date."
  })
  .refine((data) => data.max_team_size >= data.min_team_size, {
    path: ["max_team_size"],
    message:
      "Maximum team size must be greater than or equal to minimum team size."
  })
  .refine(
    (data) => {
      const prizeValues = [
        data.first_prize,
        data.second_prize,
        data.third_prize
      ].filter((value) => typeof value === "number") as number[];

      if (prizeValues.length === 0) {
        return true;
      }

      const total = prizeValues.reduce((acc, value) => acc + value, 0);
      return total <= data.prize_pool;
    },
    {
      path: ["prize_pool"],
      message: "Combined prize amounts cannot exceed the overall prize pool."
    }
  );

export const createHackathonSchema = baseHackathonSchema.safeExtend({
  created_by: uuidSchema.optional()
});

export const updateHackathonSchema = baseHackathonSchema
  .partial()
  .safeExtend({
    id: uuidSchema
  })
  .refine(
    (data) => !data.slug || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug ?? ""),
    {
      path: ["slug"],
      message:
        "Slug can only contain lowercase letters, numbers, and single hyphen separators."
    }
  );

export const hackathonFilterSchema = z.object({
  status: z
    .array(statusSchema)
    .optional()
    .default(["published", "ongoing", "completed"]),
  themes: z.array(z.string().trim().min(1)).optional(),
  search: z.string().trim().optional()
});

export type CreateHackathonInput = z.infer<typeof createHackathonSchema>;
export type UpdateHackathonInput = z.infer<typeof updateHackathonSchema>;
export type HackathonFilterInput = z.infer<typeof hackathonFilterSchema>;
