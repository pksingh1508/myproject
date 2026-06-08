import type { Metadata } from "next";
import CareerContent from "./career-content";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `Career | ${BRAND_NAME}`,
  description: `Career opportunities at ${BRAND_NAME}.`,
  alternates: {
    canonical: "/career"
  },
  openGraph: {
    title: `Career | ${BRAND_NAME}`,
    description: BRAND_DESCRIPTION
  },
  twitter: {
    title: `Career | ${BRAND_NAME}`,
    description: BRAND_DESCRIPTION
  }
};

export default function CareerPage() {
  return <CareerContent />;
}
