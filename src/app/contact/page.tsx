import type { Metadata } from "next";
import ContactContent from "./contact-content";
import { BRAND_NAME, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/constants/site";

export const metadata: Metadata = {
  title: `Contact ${BRAND_NAME}`,
  description: `Reach the ${BRAND_NAME} team at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE} for partnerships, sponsorships, and participant support.`,
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    title: `Contact ${BRAND_NAME}`,
    description: `Talk to the organisers behind India’s most energetic student hackathons via ${SUPPORT_EMAIL}.`
  },
  twitter: {
    title: `Contact ${BRAND_NAME}`,
    description: `Talk to the organisers behind India’s most energetic student hackathons via ${SUPPORT_EMAIL}.`
  }
};

export default function ContactPage() {
  return <ContactContent />;
}
