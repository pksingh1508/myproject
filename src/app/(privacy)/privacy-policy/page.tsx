import Link from "next/link";

const sections = [
  {
    title: "1. Overview",
    content: (
      <>
        <p>
          HackathonWallah (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to safeguarding the privacy of our
          students, mentors, partners, and visitors. This Privacy Policy explains how we collect, use, store, and
          share your personal information when you register on the platform, participate in a hackathon, or interact
          with our services.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          This policy applies to all websites, applications, and services operated by HackathonWallah. By using our
          platform, you consent to the practices described here.
        </p>
      </>
    )
  },
  {
    title: "2. Information We Collect",
    content: (
      <>
        <p>We collect personal and usage information in the following categories:</p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Account details:</span> name, email, phone number, age,
            institution, and location to verify eligibility and personalise your experience.
          </li>
          <li>
            <span className="font-semibold text-foreground">Hackathon data:</span> submissions, team information, project
            descriptions, and participation history so we can administer events and award prizes.
          </li>
          <li>
            <span className="font-semibold text-foreground">Payment information:</span> transaction identifiers processed
            via trusted payment gateways. We do not store full card or bank details on our servers.
          </li>
          <li>
            <span className="font-semibold text-foreground">Usage metrics:</span> log data, device information, cookies,
            and analytics to improve platform performance and security.
          </li>
        </ul>
      </>
    )
  },
  {
    title: "3. How We Use Your Information",
    content: (
      <ul className="ml-5 list-disc space-y-2 text-muted-foreground">
        <li>To register you for hackathons, form teams, and communicate important event updates.</li>
        <li>To process entry fees, issue receipts, and disburse prizes or rewards.</li>
        <li>To evaluate submissions, derive insights, and showcase winning projects (with credit to creators).</li>
        <li>To secure our systems, detect fraud, and comply with legal obligations.</li>
        <li>To send newsletters, product updates, and opportunities you opt into (you can unsubscribe anytime).</li>
      </ul>
    )
  },
  {
    title: "4. Sharing & Disclosure",
    content: (
      <>
        <p>
          We respect your privacy and only share information in the situations described below:
        </p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>
            <span className="font-semibold text-foreground">Service providers:</span> trusted vendors that help with
            payments, analytics, communication, and infrastructure strictly follow our confidentiality requirements.
          </li>
          <li>
            <span className="font-semibold text-foreground">Event partners &amp; judges:</span> limited details (name,
            email, submission information) may be shared to facilitate mentorship, evaluation, or prize distribution.
          </li>
          <li>
            <span className="font-semibold text-foreground">Legal compliance:</span> we may disclose data if required by
            law, regulation, or authorised government request.
          </li>
          <li>
            <span className="font-semibold text-foreground">Business transfers:</span> if HackathonWallah undergoes a
            merger, acquisition, or reorganisation, your information may be transferred as part of that transaction but
            will remain protected.
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
          We use industry-standard safeguards to protect your information, including encryption, secure data centres, and
          strict access controls. However, no method of transmission over the internet or electronic storage is completely
          secure; therefore, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality
          of your account credentials.
        </p>
      </>
    )
  },
  {
    title: "6. Data Retention",
    content: (
      <>
        <p>
          We retain your information for as long as necessary to fulfil the purposes outlined in this policy, or as required
          by law. You may request deletion of your account and associated data{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
            by contacting us
          </Link>
          . Certain information (such as tax or compliance records) may be retained for statutory periods even after deletion.
        </p>
      </>
    )
  },
  {
    title: "7. Cookies & Tracking Technologies",
    content: (
      <>
        <p>
          HackathonWallah uses cookies, pixels, and similar technologies to authenticate sessions, remember preferences,
          and analyse site performance. You may disable cookies through your browser settings; however, doing so may limit
          some features of the platform.
        </p>
      </>
    )
  },
  {
    title: "8. Participant Rights",
    content: (
      <>
        <p>You may have the following rights depending on your jurisdiction:</p>
        <ul className="ml-5 mt-3 list-disc space-y-2 text-muted-foreground">
          <li>Access the personal information we hold about you.</li>
          <li>Request corrections to inaccurate or incomplete data.</li>
          <li>Request deletion, restriction, or portability of your data where applicable.</li>
          <li>Withdraw consent for marketing communications at any time.</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, email us at{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="mailto:privacy@hackathonwallah.com">
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
        <p>If you have questions, concerns, or complaints about how we handle your data, contact us at:</p>
        <div className="mt-3 text-sm text-muted-foreground">
          <p>HackathonWallah Privacy Office</p>
          <p>Workspace 42, Indiranagar, Bengaluru, Karnataka 560038, India</p>
          <p>Email: <a href="mailto:privacy@hackathonwallah.com" className="text-primary underline-offset-4 hover:underline">privacy@hackathonwallah.com</a></p>
          <p>Phone: +91-98765-43210</p>
        </div>
      </>
    )
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/60 bg-muted/10">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Policy
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
            This Privacy Policy describes how HackathonWallah collects, uses, and protects your personal information when
            you participate in hackathons, workshops, or services hosted on our platform.
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
      </section>
    </main>
  );
}
