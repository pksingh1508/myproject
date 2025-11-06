import { redirect } from "next/navigation";

import { requireUserProfile } from "@/lib/auth/require-user-profile";

import { ProfilePageClient } from "./profile-page-client";

export const metadata = {
  title: "Profile | Hackathon Hub"
};

export default async function ProfilePage() {
  try {
    const { profile } = await requireUserProfile();

    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Keep your personal information up to date so organisers can reach you
            quickly.
          </p>
        </div>
        <ProfilePageClient profile={profile} />
      </div>
    );
  } catch (error) {
    console.error("Unable to load profile page:", error);
    redirect("/sign-in");
  }
}
