import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `Refund Policy | ${BRAND_NAME}`,
  description:
    "Read the HackathonWallah refund timelines, eligibility, and escalation process for paid hackathon registrations.",
  alternates: {
    canonical: "/refund-policy"
  },
  openGraph: {
    title: `Refund Policy | ${BRAND_NAME}`,
    description:
      "Refund windows and dispute resolution guidelines for HackathonWallah events."
  },
  twitter: {
    title: `Refund Policy | ${BRAND_NAME}`,
    description:
      "Refund windows and dispute resolution guidelines for HackathonWallah events."
  }
};

const sections = [
  {
    title: "1. Overview",
    content:
      "HackathonWallah aims to make participation accessible while ensuring events run smoothly for every registered student. This Refund Policy outlines when and how entry fees may be returned once a participant has registered for a hackathon hosted on the platform."
  },
  {
    title: "2. Eligibility for Refunds",
    content: (
      <>
        <p>Refund eligibility depends on the reason for cancellation and the timing of your request:</p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Participant-initiated cancellations:</span> requests must be
            submitted at least 5 days before the scheduled start of the hackathon to qualify for a partial refund.
          </li>
          <li>
            <span className="font-semibold text-foreground">Medical or emergency situations:</span> documentation may be
            required. If approved, a partial or full refund will be issued regardless of timing.
          </li>
          <li>
            <span className="font-semibold text-foreground">Event rescheduling or cancellation by HackathonWallah:</span>{" "}
            participants may choose a full refund or transfer their fee to a future hackathon.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "3. Non-Refundable Scenarios",
    content: (
      <>
        <p>Entry fees are non-refundable in the following situations:</p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>Failure to attend the hackathon without prior notice.</li>
          <li>Disqualification due to violation of the HackathonWallah code of conduct or Terms &amp; Conditions.</li>
          <li>Request submitted after the hackathon has begun.</li>
          <li>Incomplete or missing documentation for emergency-based refund requests.</li>
        </ul>
      </>
    )
  },
  {
    title: "4. Refund Amounts",
    content: (
      <>
        <p>Approved refunds will be processed as follows:</p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Full refund:</span> when HackathonWallah cancels or
            substantially alters an event, or in documented emergencies approved by our support team.
          </li>
          <li>
            <span className="font-semibold text-foreground">50% refund:</span> when a participant cancels at least 5 days
            before the event start time for personal reasons.
          </li>
          <li>
            <span className="font-semibold text-foreground">No refund:</span> when cancellations occur within 5 days of the
            event or after it has begun (unless covered by the emergency clause).
          </li>
        </ul>
      </>
    )
  },
  {
    title: "5. Refund Process & Timeline",
    content: (
      <>
        <p>
          Refund requests must be submitted via email to{" "}
          <a href="mailto:support@hackathonwallah.com" className="text-primary underline-offset-4 hover:underline">
            support@hackathonwallah.com
          </a>{" "}
          with the following details:
        </p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>Registered participant name and email.</li>
          <li>Event name and date.</li>
          <li>Reason for refund and supporting documentation (if applicable).</li>
        </ul>
        <p className="mt-3">
          Our team will respond within 5 business days. Once approved, refunds are typically processed within 7-10 business
          days. Depending on your bank or payment provider, it may take additional time for the amount to reflect.
        </p>
      </>
    )
  },
  {
    title: "6. Payment Method",
    content:
      "Refunds are issued using the original payment method whenever possible. For expired cards or failed reversals, we may request verified bank details to complete the transfer."
  },
  {
    title: "7. Transfers & Credits",
    content:
      "Instead of a monetary refund, you may request to transfer your registration to another upcoming hackathon. Transfer approvals are offered on a case-by-case basis and depend on seat availability and event-specific rules."
  },
  {
    title: "8. Special Cases for Team Registrations",
    content:
      "For team-based events, refund requests must be submitted by the team leader on behalf of all members. Partial refunds for individual teammates are not permitted unless the hackathon specifically allows individual registration."
  },
  {
    title: "9. Policy Updates",
    content:
      "HackathonWallah may update this Refund Policy from time to time to reflect changes in our events or compliance requirements. The revised policy will be posted on this page with the updated effective date."
  },
  {
    title: "10. Contact Us",
    content: (
      <>
        <p>For help regarding cancellations, refunds, or payment issues, reach out to:</p>
        <div className="mt-3 text-sm text-muted-foreground">
          <p>HackathonWallah Support</p>
          <p>Workspace 42, Indiranagar, Bengaluru, Karnataka 560038, India</p>
          <p>
            Email:{" "}
            <a href="mailto:support@hackathonwallah.com" className="text-primary underline-offset-4 hover:underline">
              support@hackathonwallah.com
            </a>
          </p>
          <p>Phone: +91-98765-43210</p>
        </div>
      </>
    )
  }
];

export default function RefundPolicyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/60 bg-muted/10">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Policy
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Refund Policy</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
            This policy explains when you can expect refunds for hackathon registration fees on HackathonWallah.
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
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{section.content}</div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            Please read this policy alongside our{" "}
            <Link href="/(privacy)/cancellation-policy" className="text-primary underline-offset-4 hover:underline">
              Cancellation Policy
            </Link>{" "}
            and{" "}
            <Link href="/(privacy)/terms-and-conditions" className="text-primary underline-offset-4 hover:underline">
              Terms &amp; Conditions
            </Link>{" "}
            for complete details on participation requirements.
          </p>
        </div>
      </section>
    </main>
  );
}
