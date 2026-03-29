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

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

const profileSelectColumns =
  "id, user_id, email, name, college_name, phone, year_of_study, branch, avatar_url, role, is_verified";

function getPrimaryEmail(clerkUser: ClerkUser) {
  const primaryEmail = clerkUser.emailAddresses.find(
    (emailAddress) => emailAddress.id === clerkUser.primaryEmailAddressId
  );

  return primaryEmail?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null;
}

function getPrimaryPhone(clerkUser: ClerkUser) {
  const primaryPhone = clerkUser.phoneNumbers.find(
    (phoneNumber) => phoneNumber.id === clerkUser.primaryPhoneNumberId
  );

  return primaryPhone?.phoneNumber ?? clerkUser.phoneNumbers[0]?.phoneNumber ?? null;
}

function getDisplayName(clerkUser: ClerkUser, email: string) {
  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || clerkUser.username || email;
}

async function syncProfileFromClerk(clerkUser: ClerkUser) {
  const email = getPrimaryEmail(clerkUser);

  if (!email) {
    throw new ProfileNotFoundError();
  }

  const supabase = createServiceRoleClient();
  const profilePayload = {
    user_id: clerkUser.id,
    email,
    name: getDisplayName(clerkUser, email),
    phone: getPrimaryPhone(clerkUser),
    avatar_url: clerkUser.imageUrl ?? null,
    role:
      clerkUser.publicMetadata?.role === "admin" ? ("admin" as const) : ("user" as const),
    is_verified:
      Boolean(clerkUser.publicMetadata?.isVerified) ||
      clerkUser.emailAddresses.some(
        (emailAddress) => emailAddress.verification?.status === "verified"
      )
  };

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("users")
    .select(profileSelectColumns)
    .eq("user_id", clerkUser.id)
    .maybeSingle<UserProfileRecord>();

  if (existingProfileError) {
    throw existingProfileError;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const { data: emailMatchedProfile, error: emailMatchedProfileError } = await supabase
    .from("users")
    .select(profileSelectColumns)
    .eq("email", email)
    .maybeSingle<UserProfileRecord>();

  if (emailMatchedProfileError) {
    throw emailMatchedProfileError;
  }

  if (emailMatchedProfile) {
    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update({
        ...profilePayload,
        updated_at: new Date().toISOString()
      })
      .eq("id", emailMatchedProfile.id)
      .select(profileSelectColumns)
      .maybeSingle<UserProfileRecord>();

    if (updateError) {
      throw updateError;
    }

    if (!updatedProfile) {
      throw new ProfileNotFoundError();
    }

    return updatedProfile;
  }

  const { data: createdProfile, error: createError } = await supabase
    .from("users")
    .insert(profilePayload)
    .select(profileSelectColumns)
    .maybeSingle<UserProfileRecord>();

  if (createError) {
    throw createError;
  }

  if (!createdProfile) {
    throw new ProfileNotFoundError();
  }

  return createdProfile;
}

export async function requireUserProfile(options: RequireUserProfileOptions = {}) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new AuthenticationRequiredError();
  }

  const profile = await syncProfileFromClerk(clerkUser);

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
