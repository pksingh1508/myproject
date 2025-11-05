import { currentUser } from "@clerk/nextjs/server";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type UserProfileRecord = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  college_name: string | null;
  phone: string | null;
  year_of_study: string | null;
  branch: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  is_verified: boolean;
};

const REQUIRED_PROFILE_FIELDS: Array<keyof UserProfileRecord> = [
  "college_name",
  "phone",
  "year_of_study",
  "branch"
];

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication required.");
    this.name = "AuthenticationRequiredError";
  }
}

export class ProfileNotFoundError extends Error {
  constructor() {
    super("User profile was not found in Supabase.");
    this.name = "ProfileNotFoundError";
  }
}

export class IncompleteProfileError extends Error {
  missingFields: string[];

  constructor(missingFields: string[]) {
    super("User profile is incomplete.");
    this.missingFields = missingFields;
    this.name = "IncompleteProfileError";
  }
}

interface RequireUserProfileOptions {
  requireCompleteProfile?: boolean;
}

export async function requireUserProfile(options: RequireUserProfileOptions = {}) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new AuthenticationRequiredError();
  }

  const supabase = createServiceRoleClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select(
      "id, user_id, email, name, college_name, phone, year_of_study, branch, avatar_url, role, is_verified"
    )
    .eq("user_id", clerkUser.id)
    .maybeSingle<UserProfileRecord>();

  if (error) {
    throw error;
  }

  if (!profile) {
    throw new ProfileNotFoundError();
  }

  if (options.requireCompleteProfile) {
    const missingFields = REQUIRED_PROFILE_FIELDS.filter((field) => {
      const value = profile[field];
      return value === null || value === undefined || value === "";
    });

    if (missingFields.length > 0) {
      throw new IncompleteProfileError(missingFields);
    }
  }

  return {
    clerkUser,
    profile
  };
}
