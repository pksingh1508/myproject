import type { Metadata } from "next";
import { HomePage } from "@/components/home";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/site";

const homepageDescription =
  "Discover upcoming student hackathons across India, learn from mentors, and get rewarded for every submission with HackathonWallah.";

export const metadata: Metadata = {
  title: `Student hackathons in India | ${BRAND_NAME}`,
  description: homepageDescription,
  keywords: [
    "india hackathon platform",
    "student hackathon 2024",
    "hackathonwallah events",
    "build submit win"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `Student hackathons in India | ${BRAND_NAME}`,
    description: homepageDescription
  },
  twitter: {
    title: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    description: homepageDescription
  }
};

export const revalidate = 120;

export default async function Home() {
  return <HomePage />;
}
