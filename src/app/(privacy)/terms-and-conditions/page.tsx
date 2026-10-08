import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/constants/site";
import { PolicyPage, type PolicySection } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${BRAND_NAME}`,
  description:
    "Understand the participation rules, eligibility guidelines, and code of conduct for every HackathonWallah event.",
  alternates: {
    canonical: "/terms-and-conditions"
  },
  openGraph: {
    title: `Terms & Conditions | ${BRAND_NAME}`,
    description:
      "Review HackathonWallah’s legal terms covering registrations, submissions, intellectual property, and rewards."
  },
  twitter: {
    title: `Terms & Conditions | ${BRAND_NAME}`,
    description:
      "Review HackathonWallah’s legal terms covering registrations, submissions, intellectual property, and rewards."
  }
};

const sections: PolicySection[] = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using HackathonWallah, you agree to these Terms and Conditions and to our Privacy, Refund, and Cancellation policies. If you do not agree with any part of these terms, you must not use the platform or participate in any hackathon hosted on HackathonWallah."
  },
  {
    title: "2. Eligibility",
    content:
      "You must be at least 16 years old or the age of majority in your jurisdiction to participate in our events. By registering, you confirm that you meet the eligibility requirements and have the legal capacity to accept these terms. HackathonWallah reserves the right to request verification documents and to refuse entry if eligibility cannot be confirmed."
  },
  {
    title: "3. Registration & Fees",
    content: (
      <>
        <p>
          Each hackathon on HackathonWallah may require an entry fee that will
          be prominently displayed during registration. All fees must be paid in
          full through the supported payment methods before your participation
          is confirmed.
        </p>
        <ul>
          <li>
            Fees are non-transferable between events unless otherwise stated.
          </li>
          <li>
            Late payments or failed transactions will result in automatic
            cancellation of your spot.
          </li>
          <li>
            Additional team members must register and pay individually unless
            the event description specifies a bundled team pricing model.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "4. Code of Conduct",
    content: (
      <>
        <p>
          We are committed to providing a respectful, inclusive environment.
          Participants must uphold professional conduct throughout the entire
          hackathon. The following behaviour is prohibited:
        </p>
        <ul>
          <li>Harassment, discrimination, or abusive language of any kind.</li>
          <li>
            Submission of plagiarised, stolen, or previously published work.
          </li>
          <li>
            Attempting to compromise platform security, manipulate results, or
            disrupt other participants.
          </li>
        </ul>
        <p>
          Violation of the code of conduct may result in immediate
          disqualification, removal from the event, and forfeiture of fees and
          prizes.
        </p>
      </>
    )
  },
  {
    title: "5. Intellectual Property",
    content: (
      <>
        <p>
          Unless otherwise stated in the hackathon brief, participants retain
          ownership of the code, designs, and intellectual property they create
          during the event. By submitting a project, you grant HackathonWallah
          and the organising partners a non-exclusive licence to showcase your
          work for marketing, judging, and archival purposes.
        </p>
        <p>
          Some hackathons may include sponsor-specific IP terms. Any additional
          clauses will be clearly mentioned on the registration page and must be
          accepted before participation.
        </p>
      </>
    )
  },
  {
    title: "6. Prize Eligibility & Distribution",
    content: (
      <>
        <p>
          HackathonWallah offers rewards for every valid submission and tiered
          prizes for top-performing teams. To remain eligible for prizes:
        </p>
        <ul>
          <li>You must submit your project before the official deadline.</li>
          <li>
            Your solution must be your team’s original work created during the
            event.
          </li>
          <li>
            You must comply with all judging criteria and documentation
            requirements outlined in the event brief.
          </li>
        </ul>
        <p>
          Prizes are typically disbursed within 30 business days after final
          results are announced. HackathonWallah may request tax information or
          identity verification if required by law prior to releasing awards.
        </p>
      </>
    )
  },
  {
    title: "7. Refund & Cancellation Policy",
    content: (
      <>
        <p>
          Our standard policy is that entry fees are non-refundable once
          registration is completed. Exceptions may be granted under the
          circumstances described in our{" "}
          <Link
            href="/refund-policy"
          >
            Refund Policy
          </Link>
          . Participants may request withdrawal before the event start time;
          however, refunds are granted at the sole discretion of
          HackathonWallah.
        </p>
        <p>
          HackathonWallah reserves the right to cancel or reschedule events. In
          such cases, affected participants will be notified promptly and
          offered refunds or transfer options to future hackathons.
        </p>
      </>
    )
  },
  {
    title: "8. Platform Use & Account Security",
    content: (
      <>
        <p>
          You agree to use the HackathonWallah platform responsibly. You are
          solely responsible for maintaining the confidentiality of your account
          credentials and for any activities that occur under your account.
          Notify us immediately of any unauthorised access or suspected breach.
        </p>
        <p>
          We may suspend or terminate accounts that violate these terms or
          exhibit suspicious behaviour that threatens the integrity of the
          platform or community.
        </p>
      </>
    )
  },
  {
    title: "9. Disclaimers",
    content: (
      <>
        <p>
          HackathonWallah provides hackathon programs on an “as-is” and
          “as-available” basis. While we strive to ensure uninterrupted service,
          we do not guarantee that access to the platform or event resources
          will be free from errors, bugs, or downtime.
        </p>
        <p>
          We are not liable for any direct, indirect, incidental, or
          consequential damages arising from your participation, inability to
          participate, or decisions based on information presented during the
          hackathons.
        </p>
      </>
    )
  },
  {
    title: "10. Indemnity",
    content:
      "You agree to indemnify and hold harmless HackathonWallah, its organisers, sponsors, and partners from any claims, damages, losses, or expenses (including legal fees) arising from your participation, your submissions, or any breach of these terms."
  },
  {
    title: "11. Changes to Terms",
    content:
      "HackathonWallah may update these Terms and Conditions at any time. Changes will be posted on this page with a revised effective date. Continued use of the platform or participation in events after updates constitutes acceptance of the revised terms."
  },
  {
    title: "12. Contact Information",
    content: (
      <>
        <p>For questions or support regarding these terms, reach out to:</p>
        <div>
          <p>HackathonWallah</p>
          <p>Workspace 42, Indiranagar</p>
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

export default function TermsAndConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      href="/terms-and-conditions"
      intro="These Terms & Conditions govern the hackathons and services provided by HackathonWallah. Please read them carefully before registering or participating."
      sections={sections}
    />
  );
}
