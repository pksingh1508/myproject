import { NextResponse } from "next/server";

import { z } from "zod";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { AppError, mapSupabaseError } from "@/lib/errors/app-error";

const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(150),
  email: z.string().trim().email("A valid email is required.").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number should contain at least 7 digits.")
    .max(32, "Phone number is too long.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  subject: z.string().trim().min(1, "Subject is required.").max(200),
  message: z.string().trim().min(1, "Message is required.").max(2000)
});

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

  console.error("Contacts API error:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to submit contact request."
    },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  let submission: z.infer<typeof contactSubmissionSchema>;

  try {
    const body = await request.json();
    submission = contactSubmissionSchema.parse(body);
  } catch (parseError) {
    const message =
      parseError instanceof z.ZodError
        ? parseError.issues[0]?.message ?? "Invalid contact payload."
        : "Invalid contact payload.";
    return NextResponse.json(
      { error: "BAD_REQUEST", message },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceRoleClient();
    const timestamp = new Date().toISOString();

    const contactRecord = {
      name: submission.name,
      email: submission.email.toLowerCase(),
      phone: submission.phone ?? null,
      subject: submission.subject,
      message: submission.message,
      updated_at: timestamp
    };

    const { error } = await supabase
      .from("contacts")
      .upsert(contactRecord, { onConflict: "email" });

    if (error) {
      throw mapSupabaseError(error, "Failed to save contact details.");
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "Thanks for reaching out. Our team will get back to you within 2-3 business days."
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
