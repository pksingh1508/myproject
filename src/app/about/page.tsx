import type { Metadata } from "next";
import AboutContent from "./about-content";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `About ${BRAND_NAME}`,
  description:
    "Meet the team that powers India’s most loved student hackathons, our values, and how we reward every shipped submission.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: `About ${BRAND_NAME}`,
    description: BRAND_DESCRIPTION
  },
  twitter: {
    title: `About ${BRAND_NAME}`,
    description: BRAND_DESCRIPTION
  }
};

export default function AboutPage() {
  return <AboutContent />;
}
