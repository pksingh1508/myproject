import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `Cancellation Policy | ${BRAND_NAME}`,
  description:
    "Understand how to cancel a HackathonWallah registration, replacement options, and applicable processing fees.",
  alternates: {
    canonical: "/cancellation-policy"
  },
  openGraph: {
    title: `Cancellation Policy | ${BRAND_NAME}`,
    description:
      "Cancellation criteria and rebooking process for HackathonWallah events."
  },
  twitter: {
    title: `Cancellation Policy | ${BRAND_NAME}`,
    description:
      "Cancellation criteria and rebooking process for HackathonWallah events."
  }
};

const sections = [
  {
    title: "1. Purpose",
    content:
      "This Cancellation Policy outlines how participants and HackathonWallah may cancel hackathon registrations or events, and the resulting effects on access, fees, and eligibility."
  },
  {
    title: "2. Participant Cancellations",
    content: (
      <>
        <p>Participants may cancel their registration by emailing</p>
        <p>
          <a
            href="mailto:help@hackathonwallah.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            help@hackathonwallah.com
          </a>{" "}
          with the subject line &ldquo;Cancellation Request&rdquo;.
        </p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>
            Include name, registered email, event name, and reason for
            cancellation.
          </li>
          <li>
            Cancellations submitted at least 5 days before the event begin
            receiving priority review and may be eligible for partial refunds
            (see{" "}
            <Link
              href="/(privacy)/refund-policy"
              className="text-primary underline-offset-4 hover:underline"
            >
              Refund Policy
            </Link>
            ).
          </li>
          <li>
            Cancellations within 5 days of the event generally do not qualify
            for refunds unless covered by emergencies.
          </li>
          <li>
            For team registrations, the team leader must submit the
            cancellation; partial team cancellations are not permitted unless
            the event has individual-entry pricing.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "3. Emergency Cancellations",
    content:
      "If a participant is unable to attend due to medical emergencies, travel disruptions, or other critical situations, they must notify HackathonWallah as soon as possible. Documentation may be required, and approved requests may receive refunds or event credits at our discretion."
  },
  {
    title: "4. No-Shows",
    content:
      "Participants who fail to attend without notifying us before the event (no-shows) forfeit their registration fees and are not eligible for refunds or transfers."
  },
  {
    title: "5. HackathonWallah Cancellations",
    content: (
      <>
        <p>
          HackathonWallah reserves the right to cancel or reschedule events due
          to:
        </p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>Low registrations or logistical constraints.</li>
          <li>
            Unforeseen emergencies (venue issues, platform outages, health
            advisories).
          </li>
          <li>Compliance with legal or regulatory requirements.</li>
        </ul>
        <p className="mt-3">
          If an event is cancelled or rescheduled by HackathonWallah, registered
          participants will be notified via email and offered either a full
          refund or complimentary transfer to another hackathon of equal value.
        </p>
      </>
    )
  },
  {
    title: "6. Transfers to Another Event",
    content:
      "Participants may request to transfer their registration to a future hackathon. Transfers depend on seat availability, event requirements, and timely submission (minimum 5 days before the original event start). HackathonWallah reserves the right to approve or deny transfer requests."
  },
  {
    title: "7. Accommodation of Special Circumstances",
    content:
      "We evaluate compassionate circumstances on a case-by-case basis. Our goal is to encourage students to keep building, so please contact us and we’ll do our best to assist."
  },
  {
    title: "8. Contact",
    content: (
      <>
        <p>For cancellation-related support, reach us at:</p>
        <div className="mt-3 text-sm text-muted-foreground">
          <p>HackathonWallah Support</p>
          <p>Indranagar, Gorakhpur, 273001, India</p>
          <p>
            Email:{" "}
            <a
              href="mailto:help@hackathonwallah.com"
              className="text-primary underline-offset-4 hover:underline"
            >
              help@hackathonwallah.com
            </a>
          </p>
        </div>
      </>
    )
  }
];

export default function CancellationPolicyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/60 bg-muted/10">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Policy
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Cancellation Policy
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
            . This policy explains how to cancel hackathon registrations and how
            HackathonWallah handles cancellations of its events.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <article
              key={section.title}
              className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            Please review this policy along with our{" "}
            <Link
              href="/(privacy)/refund-policy"
              className="text-primary underline-offset-4 hover:underline"
            >
              Refund Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/(privacy)/terms-and-conditions"
              className="text-primary underline-offset-4 hover:underline"
            >
              Terms &amp; Conditions
            </Link>{" "}
            to understand the complete set of event guidelines.
          </p>
        </div>
      </section>
    </main>
  );
}
