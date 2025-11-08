import { NextResponse } from "next/server";
import { z } from "zod";

import {
  AuthenticationRequiredError,
  IncompleteProfileError,
  requireUserProfile
} from "@/lib/auth/require-user-profile";
import {
  getParticipantForUser,
  updateParticipantSubmission
} from "@/lib/repos/participants";
import { AppError } from "@/lib/errors/app-error";

const submissionSchema = z.object({
  submissionUrl: z
    .string()
    .trim()
    .url({ message: "Please provide a valid submission URL." }),
  submissionDescription: z
    .string()
    .trim()
    .max(2000, { message: "Submission description is too long." })
    .optional()
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hackathonId } = await context.params;
    const payload = submissionSchema.parse(await request.json());
    const { profile } = await requireUserProfile();

    const participant = await getParticipantForUser(profile.id, hackathonId);

    if (!participant) {
      return NextResponse.json(
        {
          error: "NOT_REGISTERED",
          message: "You are not registered for this hackathon."
        },
        { status: 404 }
      );
    }

    if (participant.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "PAYMENT_PENDING",
          message: "Please complete your payment before submitting your project."
        },
        { status: 400 }
      );
    }

    const updated = await updateParticipantSubmission({
      participantId: participant.id,
      submissionUrl: payload.submissionUrl,
      submissionDescription: payload.submissionDescription
    });

    return NextResponse.json({
      data: {
        submissionUrl: updated.submission_url,
        submissionDescription: updated.submission_description,
        submittedAt: updated.submitted_at
      }
    });
  } catch (error) {
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
        { error: error.code, message: error.message, details: error.details },
        { status: error.status }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "Invalid submission data.",
          details: error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    console.error("Submission creation failed:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Unable to save your submission. Please try again."
      },
      { status: 500 }
    );
  }
}
