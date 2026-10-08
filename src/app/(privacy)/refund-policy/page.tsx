import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/site";
import { PolicyPage, type PolicySection } from "@/components/legal/policy-page";

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

const sections: PolicySection[] = [
  {
    title: "1. Overview",
    content:
      "HackathonWallah aims to make participation accessible while ensuring events run smoothly for every registered student. This Refund Policy outlines when and how entry fees may be returned once a participant has registered for a hackathon hosted on the platform."
  },
  {
    title: "2. Eligibility for Refunds",
    content: (
      <>
        <p>
          Refund eligibility depends on the reason for cancellation and the
          timing of your request:
        </p>
        <ul>
          <li>
            <strong>
              Participant-initiated cancellations:
            </strong>{" "}
            requests must be submitted at least 5 days before the scheduled
            start of the hackathon to qualify for a partial refund.
          </li>
          <li>
            <strong>
              Medical or emergency situations:
            </strong>{" "}
            documentation may be required. If approved, a partial or full refund
            will be issued regardless of timing.
          </li>
          <li>
            <strong>
              Event rescheduling or cancellation by HackathonWallah:
            </strong>{" "}
            participants may choose a full refund or transfer their fee to a
            future hackathon.
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
        <ul>
          <li>Failure to attend the hackathon without prior notice.</li>
          <li>
            Disqualification due to violation of the HackathonWallah code of
            conduct or Terms &amp; Conditions.
          </li>
          <li>Request submitted after the hackathon has begun.</li>
          <li>
            Incomplete or missing documentation for emergency-based refund
            requests.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "4. Refund Amounts",
    content: (
      <>
        <p>Approved refunds will be processed as follows:</p>
        <ul>
          <li>
            <strong>Full refund:</strong>{" "}
            when HackathonWallah cancels or substantially alters an event, or in
            documented emergencies approved by our support team.
          </li>
          <li>
            <strong>50% refund:</strong>{" "}
            when a participant cancels at least 5 days before the event start
            time for personal reasons.
          </li>
          <li>
            <strong>No refund:</strong>{" "}
            when cancellations occur within 5 days of the event or after it has
            begun (unless covered by the emergency clause).
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
          <a
            href="mailto:support@hackathonwallah.com"
          >
            support@hackathonwallah.com
          </a>{" "}
          with the following details:
        </p>
        <ul>
          <li>Registered participant name and email.</li>
          <li>Event name and date.</li>
          <li>
            Reason for refund and supporting documentation (if applicable).
          </li>
        </ul>
        <p>
          Our team will respond within 5 business days. Once approved, refunds
          are typically processed within 7-10 business days. Depending on your
          bank or payment provider, it may take additional time for the amount
          to reflect.
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
        <p>
          For help regarding cancellations, refunds, or payment issues, reach
          out to:
        </p>
        <div>
          <p>HackathonWallah Support</p>
          <p>Indranagar, Gorakhpur, 273001, India</p>
          <p>
            Email:{" "}
            <a
              href="mailto:hubhackathon15@gmail.com"
            >
              hubhackathon15@gmail.com
            </a>
          </p>
        </div>
      </>
    )
  }
];

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      href="/refund-policy"
      intro="This policy explains when you can expect refunds for hackathon registration fees on HackathonWallah."
      sections={sections}
    />
  );
}
