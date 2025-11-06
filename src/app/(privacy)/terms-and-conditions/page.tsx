import Link from "next/link";

const sections = [
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
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
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
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>Harassment, discrimination, or abusive language of any kind.</li>
          <li>
            Submission of plagiarised, stolen, or previously published work.
          </li>
          <li>
            Attempting to compromise platform security, manipulate results, or
            disrupt other participants.
          </li>
        </ul>
        <p className="mt-3">
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
        <p className="mt-3">
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
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
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
        <p className="mt-3">
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
            href="/(privacy)/refund-policy"
            className="text-primary underline-offset-4 hover:underline"
          >
            Refund Policy
          </Link>
          . Participants may request withdrawal before the event start time;
          however, refunds are granted at the sole discretion of
          HackathonWallah.
        </p>
        <p className="mt-3">
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
        <p className="mt-3">
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
        <p className="mt-3">
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
        <div className="mt-3 text-sm text-muted-foreground">
          <p>HackathonWallah</p>
          <p>Workspace 42, Indiranagar</p>
          <p>Bengaluru, Karnataka 560038, India</p>
          <p className="mt-2">
            Email:{" "}
            <a
              href="mailto:legal@hackathonwallah.com"
              className="text-primary underline-offset-4 hover:underline"
            >
              legal@hackathonwallah.com
            </a>
          </p>
          <p>Phone: +91-98765-43210</p>
        </div>
      </>
    )
  }
];

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/60 bg-muted/10">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Policy
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
            . These Terms &amp; Conditions govern the hackathons and services
            provided by HackathonWallah. Please read them carefully before
            registering or participating.
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
      </section>
    </main>
  );
}
