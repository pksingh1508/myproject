import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_TAGLINE,
  HQ_CITY,
  HQ_COUNTRY,
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_PHONE
} from "@/constants/site";
import { FAQ as FAQ_ENTRIES } from "@/constants/data";

const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

const structuredDataGeneratedAt = new Date().toISOString();

const talkingPoints = [
  {
    title: "Campus-first problem statements",
    description:
      "Every HackathonWallah brief is co-created with Indian universities and industry partners so students build for real users, not hypothetical case studies."
  },
  {
    title: "Mentors, investors, and recruiters",
    description:
      "We pair teams with founders, product leaders, and VCs who provide actionable feedback and surface internship, funding, or hiring opportunities."
  },
  {
    title: "Guaranteed rewards for every submission",
    description:
      "Our mantra—“Submit something. Celebrate everything.” —means teams receive certificates, swag, or cash credits even if they do not win the grand prize."
  },
  {
    title: "Mixed-format hackathons",
    description:
      "Join virtual build sprints from anywhere in India or travel to marquee on-ground finales in Bengaluru, Hyderabad, and Mumbai with full logistical support."
  }
];

const keywordClusters = [
  "student hackathons india",
  "indian hackathon platform",
  "college innovation challenges",
  "buildshipwin",
  "hackathon rewards for submissions",
  "mentor led hackathon",
  "hackathonwallah community",
  "submit something celebrate everything"
];

export function SeoContent() {
  const faqStructuredData = FAQ_ENTRIES.slice(0, 6).map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer
    }
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: BRAND_NAME,
        url: SITE_URL,
        description: BRAND_DESCRIPTION,
        slogan: BRAND_TAGLINE,
        email: SUPPORT_EMAIL,
        telephone: SUPPORT_PHONE,
        location: {
          "@type": "Place",
          name: `${HQ_CITY}, ${HQ_COUNTRY}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: HQ_CITY,
            addressCountry: HQ_COUNTRY
          }
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: SUPPORT_EMAIL,
            telephone: SUPPORT_PHONE,
            areaServed: ["IN", "Global"],
            availableLanguage: ["English", "Hindi"]
          }
        ],
        sameAs: [
          "https://www.linkedin.com/company/hackathonwallah",
          "https://www.instagram.com/hackathonwallah",
          "https://twitter.com/hackathonwallah"
        ],
        logo: `${SITE_URL}/brand.png`
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        publisher: { "@id": `${SITE_URL}#organization` },
        description: BRAND_DESCRIPTION,
        potentialAction: [
          {
            "@type": "SearchAction",
            target: `${SITE_URL}/hackathons?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "EventSeries",
        "@id": `${SITE_URL}#event-series`,
        name: "HackathonWallah National Hackathons",
        organizer: { "@id": `${SITE_URL}#organization` },
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        keywords: keywordClusters,
        inLanguage: "en-IN",
        location: [
          {
            "@type": "Place",
            name: "Virtual (Pan-India)",
            address: { "@type": "PostalAddress", addressCountry: "India" }
          },
          {
            "@type": "Place",
            name: "On-ground finales",
            address: {
              "@type": "PostalAddress",
              addressLocality: HQ_CITY,
              addressCountry: HQ_COUNTRY
            }
          }
        ],
        startDate: structuredDataGeneratedAt
      },
      {
        "@type": "FAQPage",
        mainEntity: faqStructuredData
      }
    ]
  };

  return (
    <section
      className="w-full bg-background py-16 sm:py-20"
      aria-labelledby="seo-content-heading"
      style={brandDisplayStyle}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Why builders choose HackathonWallah
          </p>
          <h2
            id="seo-content-heading"
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            India&apos;s home for student-led innovation and real-world
            hackathons
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {BRAND_DESCRIPTION} From tier-1 colleges to emerging campuses, we
            help teams discover themed hackathons, learn from mentors,
            collaborate with investors, and turn every shipped project into a
            celebrated milestone.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {talkingPoints.map((point) => (
            <article
              key={point.title}
              className="rounded-3xl border border-border/70 bg-muted/30 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </section>
  );
}
