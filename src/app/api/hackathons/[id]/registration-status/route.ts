import { NextResponse } from "next/server";

import {
  AuthenticationRequiredError,
  requireUserProfile
} from "@/lib/auth/require-user-profile";
import { getParticipantForUser } from "@/lib/repos/participants";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hackathonId } = await context.params;
    const { profile } = await requireUserProfile();
    const participant = await getParticipantForUser(profile.id, hackathonId);

    if (!participant) {
      return NextResponse.json({ registered: false });
    }

    return NextResponse.json({
      registered: true,
      participant: {
        id: participant.id,
        paymentStatus: participant.payment_status,
        paymentId: participant.payment_id
      }
    });
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json(
        { registered: false, requiresAuth: true },
        { status: 401 }
      );
    }

    console.error("Registration status error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR", message: "Failed to load status." },
      { status: 500 }
    );
  }
}
