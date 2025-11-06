"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "sonner";

import { ProfileForm } from "@/components/registration/profile-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { UserProfileRecord } from "@/lib/auth/require-user-profile";
import type { UserProfileUpdateInput } from "@/lib/validation/users";

type ProfilePageClientProps = {
  profile: UserProfileRecord;
};

type PersonalInfoField =
  | "name"
  | "college_name"
  | "branch"
  | "phone"
  | "year_of_study";

const FIELD_LABELS: Record<PersonalInfoField, string> = {
  name: "name",
  college_name: "college name",
  branch: "branch",
  phone: "phone number",
  year_of_study: "year of study"
};

function computeMissingFields(
  profile: Pick<UserProfileRecord, PersonalInfoField>
) {
  return (Object.entries({
    name: profile.name,
    college_name: profile.college_name,
    branch: profile.branch,
    phone: profile.phone,
    year_of_study: profile.year_of_study
  }) as Array<[PersonalInfoField, string | null]>)
    .filter(([, value]) => !value || value.toString().trim().length === 0)
    .map(([field]) => field);
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [missingFields, setMissingFields] = useState<string[]>(() =>
    computeMissingFields(profile)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues = useMemo<Partial<UserProfileUpdateInput>>(
    () => ({
      name: currentProfile.name,
      college_name: currentProfile.college_name ?? "",
      branch: currentProfile.branch ?? "",
      phone: currentProfile.phone ?? "",
      year_of_study: currentProfile.year_of_study ?? ""
    }),
    [currentProfile]
  );

  const handleSubmit = useCallback(
    async (values: UserProfileUpdateInput) => {
      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(values)
        });

        const text = await response.text();
        let payload: Record<string, unknown> | null = null;
        if (text) {
          try {
            payload = JSON.parse(text) as Record<string, unknown>;
          } catch (parseError) {
            console.error("Failed to parse profile update response:", parseError);
          }
        }

        if (!response.ok) {
          const message =
            typeof payload?.message === "string"
              ? payload.message
              : "Failed to update profile.";
          throw new Error(message);
        }

        const updatedProfile = (payload?.profile ??
          currentProfile) as UserProfileRecord;
        setCurrentProfile(updatedProfile);

        const updatedMissingFields = Array.isArray(payload?.missingFields)
          ? (payload?.missingFields as string[])
          : computeMissingFields(updatedProfile);
        setMissingFields(updatedMissingFields);

        const successMessage =
          updatedMissingFields.length > 0
            ? "Profile saved. Please complete the remaining fields when you can."
            : "Profile updated successfully.";
        toast.success(successMessage);
      } catch (updateError) {
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Failed to update profile."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [currentProfile]
  );

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Personal information</CardTitle>
        <CardDescription>
          These details help organisers contact you and confirm your eligibility.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {missingFields.length > 0 ? (
          <Alert>
            <AlertTitle>Your profile is incomplete</AlertTitle>
            <AlertDescription>
              Please provide your{" "}
              {missingFields
                .map(
                  (field) => FIELD_LABELS[field as PersonalInfoField] ?? field
                )
                .join(", ")}{" "}
              so we can keep you in the loop for hackathon updates.
            </AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Profile update failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <ProfileForm
          defaultValues={defaultValues}
          submitting={submitting}
          onSubmit={handleSubmit}
          fullWidthSubmitButton={false}
          submitButtonClassName="px-8"
          renderSubmitContent={({ submitting: isSubmitting }) =>
            isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Save profile</span>
            )
          }
        />
      </CardContent>
    </Card>
  );
}
