import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/constants/site";
import { PolicyPage, type PolicySection } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND_NAME}`,
  description:
    "Learn how HackathonWallah collects, stores, and protects participant data across hackathons, payments, and communications.",
  alternates: {
    canonical: "/privacy-policy"
  },
  openGraph: {
    title: `Privacy Policy | ${BRAND_NAME}`,
    description:
      "Transparent privacy practices for the HackathonWallah platform, events, and partner initiatives."
  },
  twitter: {
    title: `Privacy Policy | ${BRAND_NAME}`,
    description:
      "Transparent privacy practices for the HackathonWallah platform, events, and partner initiatives."
  }
};

const sections: PolicySection[] = [
  {
    title: "1. Overview",
    content: (
      <>
        <p>
          HackathonWallah (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
          &ldquo;us&rdquo;) is committed to safeguarding the privacy of our
          students, mentors, partners, and visitors. This Privacy Policy
          explains how we collect, use, store, and share your personal
          information when you register on the platform, participate in a
          hackathon, or interact with our services.
        </p>
        <p>
          This policy applies to all websites, applications, and services
          operated by HackathonWallah. By using our platform, you consent to the
          practices described here.
        </p>
      </>
    )
  },
  {
    title: "2. Information We Collect",
    content: (
      <>
        <p>
          We collect personal and usage information in the following categories:
        </p>
        <ul>
          <li>
            <strong>
              Account details:
            </strong>{" "}
            name, email, phone number, age, institution, and location to verify
            eligibility and personalise your experience.
          </li>
          <li>
            <strong>
              Hackathon data:
            </strong>{" "}
            submissions, team information, project descriptions, and
            participation history so we can administer events and award prizes.
          </li>
          <li>
            <strong>
              Payment information:
            </strong>{" "}
            transaction identifiers processed via trusted payment gateways. We
            do not store full card or bank details on our servers.
          </li>
          <li>
            <strong>
              Usage metrics:
            </strong>{" "}
            log data, device information, cookies, and analytics to improve
            platform performance and security.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "3. How We Use Your Information",
    content: (
      <ul>
        <li>
          To register you for hackathons, form teams, and communicate important
          event updates.
        </li>
        <li>
          To process entry fees, issue receipts, and disburse prizes or rewards.
        </li>
        <li>
          To evaluate submissions, derive insights, and showcase winning
          projects (with credit to creators).
        </li>
        <li>
          To secure our systems, detect fraud, and comply with legal
          obligations.
        </li>
        <li>
          To send newsletters, product updates, and opportunities you opt into
          (you can unsubscribe anytime).
        </li>
      </ul>
    )
  },
  {
    title: "4. Sharing & Disclosure",
    content: (
      <>
        <p>
          We respect your privacy and only share information in the situations
          described below:
        </p>
        <ul>
          <li>
            <strong>
              Service providers:
            </strong>{" "}
            trusted vendors that help with payments, analytics, communication,
            and infrastructure strictly follow our confidentiality requirements.
          </li>
          <li>
            <strong>
              Event partners &amp; judges:
            </strong>{" "}
            limited details (name, email, submission information) may be shared
            to facilitate mentorship, evaluation, or prize distribution.
          </li>
          <li>
            <strong>
              Legal compliance:
            </strong>{" "}
            we may disclose data if required by law, regulation, or authorised
            government request.
          </li>
          <li>
            <strong>
              Business transfers:
            </strong>{" "}
            if HackathonWallah undergoes a merger, acquisition, or
            reorganisation, your information may be transferred as part of that
            transaction but will remain protected.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "5. Data Security",
    content: (
      <>
        <p>
          We use industry-standard safeguards to protect your information,
          including encryption, secure data centres, and strict access controls.
          However, no method of transmission over the internet or electronic
          storage is completely secure; therefore, we cannot guarantee absolute
          security. You are responsible for maintaining the confidentiality of
          your account credentials.
        </p>
      </>
    )
  },
  {
    title: "6. Data Retention",
    content: (
      <>
        <p>
          We retain your information for as long as necessary to fulfil the
          purposes outlined in this policy, or as required by law. You may
          request deletion of your account and associated data{" "}
          <Link
            href="/contact"
          >
            by contacting us
          </Link>
          . Certain information (such as tax or compliance records) may be
          retained for statutory periods even after deletion.
        </p>
      </>
    )
  },
  {
    title: "7. Cookies & Tracking Technologies",
    content: (
      <>
        <p>
          HackathonWallah uses cookies, pixels, and similar technologies to
          authenticate sessions, remember preferences, and analyse site
          performance. You may disable cookies through your browser settings;
          however, doing so may limit some features of the platform.
        </p>
      </>
    )
  },
  {
    title: "8. Participant Rights",
    content: (
      <>
        <p>You may have the following rights depending on your jurisdiction:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Request corrections to inaccurate or incomplete data.</li>
          <li>
            Request deletion, restriction, or portability of your data where
            applicable.
          </li>
          <li>Withdraw consent for marketing communications at any time.</li>
        </ul>
        <p>
          To exercise these rights, email us at{" "}
          <a
            href="mailto:privacy@hackathonwallah.com"
          >
            privacy@hackathonwallah.com
          </a>
          . We may need to verify your identity before fulfilling requests.
        </p>
      </>
    )
  },
  {
    title: "9. International Participants",
    content:
      "HackathonWallah is headquartered in India, but students from around the world participate. By providing your information, you consent to its transfer and storage in India or other jurisdictions where we or our partners operate, subject to appropriate safeguards."
  },
  {
    title: "10. Third-Party Links",
    content:
      "Our platform may contain links to third-party websites (such as sponsor portals or community groups). We are not responsible for the privacy practices of those sites. We encourage you to review their policies before sharing any personal information."
  },
  {
    title: "11. Changes to This Policy",
    content:
      "We may update this Privacy Policy to reflect new features, legal requirements, or improvements. Changes will be posted on this page with an updated effective date. Continued use of the platform after modifications indicates acceptance of the revised policy."
  },
  {
    title: "12. Contact Us",
    content: (
      <>
        <p>
          If you have questions, concerns, or complaints about how we handle
          your data, contact us at:
        </p>
        <div>
          <p>HackathonWallah Privacy Office</p>
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

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      href="/privacy-policy"
      intro="This Privacy Policy describes how HackathonWallah collects, uses, and protects your personal information when you participate in hackathons, workshops, or services hosted on our platform."
      sections={sections}
    />
  );
}
