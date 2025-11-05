import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  AuthenticationRequiredError,
  ProfileNotFoundError,
  requireUserProfile
} from "@/lib/auth/require-user-profile";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  userProfileUpdateSchema,
  type UserProfileUpdateInput
} from "@/lib/validation/users";
import { AppError, mapSupabaseError } from "@/lib/errors/app-error";

function handleError(error: unknown) {
  if (error instanceof AuthenticationRequiredError) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: error.message },
      { status: 401 }
    );
  }

  if (error instanceof ProfileNotFoundError) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: error.message },
      { status: 404 }
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

  console.error("Unexpected profile API error:", error);
  return NextResponse.json(
    { error: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const { profile } = await requireUserProfile();

    const missingFields = Object.entries({
      college_name: profile.college_name,
      branch: profile.branch,
      phone: profile.phone,
      year_of_study: profile.year_of_study
    })
      .filter(([, value]) => !value || value === "")
      .map(([key]) => key);

    return NextResponse.json({
      profile,
      complete: missingFields.length === 0,
      missingFields
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Authentication required." },
      { status: 401 }
    );
  }

  let payload: UserProfileUpdateInput;
  try {
    const json = await request.json();
    payload = userProfileUpdateSchema.parse(json);
  } catch (error) {
    return NextResponse.json(
      {
        error: "BAD_REQUEST",
        message: "Invalid profile payload.",
        details: error instanceof Error ? error.message : error
      },
      { status: 400 }
    );
  }

  try {
    const { profile } = await requireUserProfile();
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("users")
      .update({
        name: payload.name,
        college_name: payload.college_name,
        branch: payload.branch,
        phone: payload.phone,
        year_of_study: payload.year_of_study,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);

    if (error) {
      throw mapSupabaseError(error, "Failed to update profile.");
    }

    const { profile: updatedProfile } = await requireUserProfile();

    const missingFields = Object.entries({
      college_name: updatedProfile.college_name,
      branch: updatedProfile.branch,
      phone: updatedProfile.phone,
      year_of_study: updatedProfile.year_of_study
    })
      .filter(([, value]) => !value || value === "")
      .map(([key]) => key);

    return NextResponse.json({
      profile: updatedProfile,
      complete: missingFields.length === 0,
      missingFields
    });
  } catch (error) {
    return handleError(error);
  }
}
