import { NextResponse } from "next/server";

import {
  AuthenticationRequiredError,
  IncompleteProfileError,
  requireUserProfile
} from "@/lib/auth/require-user-profile";
import { AppError } from "@/lib/errors/app-error";
import { registerParticipant } from "@/lib/repos/participants";
import { getHackathonById } from "@/lib/repos/hackathons";
import { participantRegistrationSchema } from "@/lib/validation/participants";
import { dispatchNotification } from "@/lib/notifications";

function isRegistrationOpen(hackathon: Awaited<ReturnType<typeof getHackathonById>>) {
  const now = new Date();
  const registrationStart = new Date(hackathon.registration_start);
  const registrationEnd = new Date(hackathon.registration_end);

  return now >= registrationStart && now <= registrationEnd;
}

function handleError(error: unknown) {
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

  console.error("Participant registration error:", error);
  return NextResponse.json(
    { error: "INTERNAL_SERVER_ERROR", message: "Unable to register." },
    { status: 500 }
  );
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid registration payload." },
      { status: 400 }
    );
  }

  try {
    const { profile } = await requireUserProfile({
      requireCompleteProfile: true
    });

    const hackathon = await getHackathonById(params.id);

    if (!["published", "ongoing"].includes(hackathon.status)) {
      return NextResponse.json(
        {
          error: "REGISTRATION_CLOSED",
          message: "This hackathon is not accepting registrations right now."
        },
        { status: 400 }
      );
    }

    if (!isRegistrationOpen(hackathon)) {
      return NextResponse.json(
        {
          error: "REGISTRATION_CLOSED",
          message: "Registration window has closed for this hackathon."
        },
        { status: 400 }
      );
    }

    if (
      typeof hackathon.max_participants === "number" &&
      hackathon.current_participants >= hackathon.max_participants
    ) {
      return NextResponse.json(
        {
          error: "REGISTRATION_FULL",
          message: "This hackathon has reached the participant limit."
        },
        { status: 409 }
      );
    }

    const parsed = participantRegistrationSchema.parse({
      hackathonId: params.id,
      userId: profile.id,
      teamName: (body as { teamName?: string }).teamName ?? undefined,
      teamMembers: (body as { teamMembers?: unknown }).teamMembers
    });

    const teamSize =
      1 + (parsed.teamMembers ? parsed.teamMembers.length : 0);

    if (teamSize < hackathon.min_team_size) {
      return NextResponse.json(
        {
          error: "INVALID_TEAM_SIZE",
          message: `Team must have at least ${hackathon.min_team_size} members (including you).`
        },
        { status: 400 }
      );
    }

    if (teamSize > hackathon.max_team_size) {
      return NextResponse.json(
        {
          error: "INVALID_TEAM_SIZE",
          message: `Team can have at most ${hackathon.max_team_size} members (including you).`
        },
        { status: 400 }
      );
    }

    const participant = await registerParticipant(parsed);

    try {
      await dispatchNotification({
        userId: profile.id,
        template: "registration_pending_payment",
        data: {
          hackathonTitle: hackathon.title,
          amount: hackathon.participation_fee ?? 0
        }
      });
    } catch (notificationError) {
      console.error(
        "Failed to send registration notification:",
        notificationError
      );
    }

    return NextResponse.json({
      data: {
        id: participant.id,
        paymentStatus: participant.payment_status
      }
    });
  } catch (error) {
    return handleError(error);
  }
}
