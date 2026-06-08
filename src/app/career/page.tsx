import type { Metadata } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/constants/site";

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

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
  return (
    <main className="bg-background text-foreground" style={brandSansStyle}>
      <section className="mx-auto flex min-h-[58vh] w-full max-w-6xl flex-col justify-center gap-6 px-4 py-20 sm:px-6 lg:px-8">
        <span className="inline-flex w-fit items-center rounded-full border border-border/80 bg-muted/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Career
        </span>
        <h1
          className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          style={brandDisplayStyle}
        >
          Career
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Career opportunities at HackathonWallah will be listed here soon.
        </p>
      </section>
    </main>
  );
}
