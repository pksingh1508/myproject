import type { Metadata } from "next";
import { jobData } from "@/constants/jobData";
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
      <section className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <span className="inline-flex w-fit items-center rounded-full border border-border/80 bg-muted/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Career
        </span>
        <h1
          className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          style={brandDisplayStyle}
        >
          Build your career with HackathonWallah.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Explore open roles and apply for the team that matches your skills.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-24 sm:px-6 lg:px-8">
        {jobData.map((job) => {
          const applyHref = `mailto:hello@hackathonwallah.com?subject=${encodeURIComponent(
            `Application for ${job.title}`,
          )}`;

          return (
            <article
              key={job.title}
              className="rounded-2xl border border-border/60 bg-muted/40 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2
                      className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                      style={brandDisplayStyle}
                    >
                      {job.title}
                    </h2>
                    <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {job.salaryRange}
                    </span>
                  </div>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {job.description}
                  </p>
                </div>

                <a
                  href={applyHref}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Apply
                </a>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                    Responsibilities
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    {job.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-primary/70" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                    Required Skills
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm text-muted-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
