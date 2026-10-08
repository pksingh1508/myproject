"use client";

import { useCallback, useMemo, useState } from "react";

import { toast } from "sonner";

import { AlertCircle, Check } from "lucide-react";

import { ProfileForm } from "@/components/registration/profile-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
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

  const totalFields = Object.keys(FIELD_LABELS).length;
  const completion = Math.round(
    ((totalFields - missingFields.length) / totalFields) * 100
  );

  return (
    <div className="flex flex-col gap-5">
      <ProfileSummary profile={currentProfile} completion={completion} />

      <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-soft sm:p-9">
        <div className="flex flex-col gap-1.5 border-b border-border pb-6">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Personal information
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            These details help organisers contact you and confirm your
            eligibility.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-6">
          {missingFields.length > 0 ? (
            <Alert className="border-marigold/50 bg-marigold/10">
              <AlertCircle className="text-marigold-ink" />
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
            submitButtonClassName="h-12 px-7"
            renderSubmitContent={({ submitting: isSubmitting }) =>
              isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save profile</span>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "HW"
  );
}

/** Identity card with a completion ring around the profile's progress. */
function ProfileSummary({
  profile,
  completion
}: {
  profile: UserProfileRecord;
  completion: number;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const complete = completion >= 100;
  const meta = [profile.college_name, profile.branch, profile.year_of_study]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-foreground p-6 text-background shadow-lift sm:flex-row sm:items-center sm:p-8">
      <div
        aria-hidden
        className="absolute inset-0 bg-graph mask-fade-edges [--grid-line:color-mix(in_oklch,var(--background),transparent_90%)]"
      />
      <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-signal font-display text-xl font-semibold text-ink">
        {initialsOf(profile.name ?? "")}
      </span>
      <div className="relative min-w-0 flex-1">
        <p className="truncate font-display text-2xl font-semibold tracking-[-0.03em]">
          {profile.name || "Unnamed builder"}
        </p>
        <p className="truncate font-mono text-xs text-background/60">{profile.email}</p>
        {meta ? <p className="mt-2 text-sm text-background/75">{meta}</p> : null}
      </div>
      <div className="relative flex items-center gap-3">
        <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-background/15" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - completion / 100)}
            className="stroke-signal transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div>
          <p className="font-display text-2xl font-semibold leading-none tracking-tight">
            {completion}%
          </p>
          <p className="mt-1 flex items-center gap-1 font-mono text-[0.7rem] text-background/60">
            {complete ? <Check className="size-3 text-signal" strokeWidth={3} /> : null}
            {complete ? "complete" : "profile complete"}
          </p>
        </div>
      </div>
    </div>
  );
}
