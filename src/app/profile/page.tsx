import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import {
  AuthenticationRequiredError,
  requireUserProfile
} from "@/lib/auth/require-user-profile";

import { ProfilePageClient } from "./profile-page-client";
import { BRAND_NAME } from "@/constants/site";
import { SectionLabel } from "@/components/decor/section-label";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: `Profile | ${BRAND_NAME}`,
  robots: {
    index: false,
    follow: false
  }
};

export default async function ProfilePage() {
  try {
    const { profile } = await requireUserProfile();

    return (
      <div className="container-page pb-24 pt-[calc(var(--header-h)+3rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+4.5rem)]">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <Reveal className="flex flex-col gap-5" y={14}>
            <SectionLabel>your profile</SectionLabel>
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] [font-stretch:92%]">
              Profile
            </h1>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              Keep your personal information up to date so organisers can reach
              you quickly.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ProfilePageClient profile={profile} />
          </Reveal>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Unable to load profile page:", error);
    if (error instanceof AuthenticationRequiredError) {
      redirect("/sign-in");
    }

    throw error;
  }
}
