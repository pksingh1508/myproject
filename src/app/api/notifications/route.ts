import { NextResponse } from "next/server";

import { requireUserProfile } from "@/lib/auth/require-user-profile";
import {
  listNotificationsForUser,
  markNotificationRead
} from "@/lib/repos/notifications";
import { AppError } from "@/lib/errors/app-error";
import { z } from "zod";

const markSchema = z.object({
  notificationId: z.string().uuid()
});

function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.code, message: error.message, details: error.details },
      { status: error.status }
    );
  }

  console.error("Notifications API error:", error);
  return NextResponse.json(
    { error: "INTERNAL_SERVER_ERROR", message: "Unable to process request." },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const { profile } = await requireUserProfile();
    const notifications = await listNotificationsForUser({
      userId: profile.id,
      limit: 25
    });

    return NextResponse.json({ data: notifications });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { profile } = await requireUserProfile();
    const body = await request.json();
    const parsed = markSchema.parse(body);

    await markNotificationRead(parsed.notificationId, profile.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
