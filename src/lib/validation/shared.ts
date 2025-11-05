import { z } from "zod";

export const uuidSchema = z.string().uuid({
  message: "A valid UUID is required."
});

export const isoDateTimeSchema = z
  .preprocess((value) => {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (!Number.isNaN(date.valueOf())) {
        return date;
      }
    }

    return value;
  }, z.date())
  .transform((date) => date.toISOString());

export const positiveIntegerSchema = z
  .number()
  .int()
  .positive({ message: "Value must be a positive integer." });

export const nonNegativeIntegerSchema = z.number().int().min(0, {
  message: "Value must be zero or a positive integer."
});

export const monetaryAmountSchema = z.number().min(0, {
  message: "Amount must be zero or greater."
});

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "A valid email address is required." });

interface OptionalTrimmedStringOptions {
  min?: number;
  max?: number;
  message?: string;
}

export const optionalTrimmedString = (
  options: OptionalTrimmedStringOptions = {}
) => {
  let schema = z.string().trim();

  if (typeof options.min === "number") {
    schema = schema.min(options.min, {
      message: options.message ?? `Value must be at least ${options.min} characters.`
    });
  }

  if (typeof options.max === "number") {
    schema = schema.max(options.max, {
      message:
        options.message ??
        `Value must be at most ${options.max} characters long.`
    });
  }

  return schema
    .optional()
    .transform((value) => (value && value.length ? value : undefined));
};
