"use client";

import { useId, useState } from "react";
import { m } from "motion/react";
import { Check, Clock3, Copy, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { SectionLabel } from "@/components/decor/section-label";
import { BrandButton } from "@/components/layout/brand-button";
import { EASE_IN_OUT } from "@/components/motion/easing";
import { Reveal } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_EMAIL = "hubhackathon15@gmail.com";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactContent() {
  const [formValues, setFormValues] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const text = await response.text();
      const payload = text
        ? (JSON.parse(text) as Record<string, unknown>)
        : null;

      if (!response.ok) {
        const message =
          typeof payload?.message === "string"
            ? payload.message
            : "Unable to send your message. Please try again.";
        throw new Error(message);
      }

      setFormValues(initialState);
      toast.success(
        (payload?.message as string) ??
          "Thanks for getting in touch. We’ll reach out soon.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again in a moment.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-[calc(var(--header-h)+3rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+4.5rem)]">
      <GridBackdrop spotlight />
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <Reveal y={12}>
            <SectionLabel>contact</SectionLabel>
          </Reveal>
          <h1 className="font-display text-[clamp(2.3rem,5.6vw,4.6rem)] font-semibold leading-[0.97] tracking-[-0.045em] [font-stretch:92%]">
            <MaskLine trigger="mount" delay={0.05}>
              Talk to the
            </MaskLine>
            <MaskLine trigger="mount" delay={0.12}>
              HackathonWallah
            </MaskLine>
            <MaskLine trigger="mount" delay={0.19}>
              team<span className="text-signal">.</span>
            </MaskLine>
          </h1>
          <Reveal delay={0.15} y={14}>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Whether you&rsquo;re a student, mentor, or partner brand,
              we&rsquo;re here to help you ship your next idea.
            </p>
          </Reveal>

          <Reveal delay={0.22} y={14}>
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              <li className="flex items-center gap-4 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-background">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-display text-base font-medium tracking-tight underline decoration-foreground/20 underline-offset-[5px] transition-colors hover:decoration-signal sm:text-lg"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <CopyButton value={CONTACT_EMAIL} />
              </li>
              <li className="flex items-center gap-4 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-signal text-ink">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Office
                  </p>
                  <p className="font-display text-lg font-medium tracking-tight">
                    Noida, Sector 62, India
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold text-ink">
                  <Clock3 className="size-4" />
                </span>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Response time
                  </p>
                  <p className="font-display text-lg font-medium tracking-tight">
                    Within 2–3 business days
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>

          <PaperPlane />
        </div>

        <Reveal delay={0.15} y={40} className="lg:col-span-7">
          <div className="relative rounded-[2rem] border border-border bg-card p-6 shadow-lift sm:p-10">
            <span
              aria-hidden
              className="absolute -top-4 right-6 hidden rotate-[4deg] rounded-full bg-hilite px-3.5 py-1 font-hand text-[1.05rem] font-bold text-ink shadow-sticker sm:block"
            >
              we read everything!
            </span>
            <div className="border-b border-border pb-6">
              <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
                How can we help?
              </p>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Share as much detail as you can so we can connect you to the
                right organisers or mentors.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Phone" htmlFor="phone" hint="optional">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91-XXXXXXXXXX"
                    value={formValues.phone}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Subject" htmlFor="subject">
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Tell us what this is about"
                    value={formValues.subject}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>

              <Field label="Message" htmlFor="message">
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Share your idea, question, or support request..."
                  className="min-h-[11rem]"
                  value={formValues.message}
                  onChange={handleChange}
                  required
                />
              </Field>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground">
                  By sending this, you agree to be contacted about your request.
                </p>
                <BrandButton
                  type="submit"
                  size="lg"
                  arrow
                  loading={submitting}
                  loadingText="Sending…"
                >
                  Send message
                </BrandButton>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={htmlFor} className="justify-between">
        {label}
        {hint ? (
          <span className="font-mono text-[0.68rem] font-normal lowercase text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="hidden h-8 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:inline-flex"
    >
      {copied ? <Check className="size-3 text-signal-ink" /> : <Copy className="size-3" />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

/** A paper plane whose dotted flight path draws itself in. */
function PaperPlane() {
  const maskId = `plane-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div aria-hidden className="relative hidden h-36 text-brand lg:block">
      <svg viewBox="0 0 260 140" className="absolute inset-0 h-full w-auto overflow-visible">
        <defs>
          <mask id={maskId}>
            <m.path
              d="M8 128C70 132 64 70 110 76S168 120 214 46"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.6, delay: 0.4, ease: EASE_IN_OUT }}
            />
          </mask>
        </defs>
        <path
          d="M8 128C70 132 64 70 110 76S168 120 214 46"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 7"
          mask={`url(#${maskId})`}
          className="opacity-60"
        />
        <m.g
          initial={{ opacity: 0, x: -24, y: 30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay: 1.5, ease: EASE_IN_OUT }}
        >
          <g transform="translate(210 26) rotate(-28)">
            <path d="M0 10L40 0L12 18Z" className="fill-signal" />
            <path d="M12 18L40 0L16 30Z" className="fill-[#1b436b] dark:fill-brand" />
            <path d="M0 10L12 18L16 30" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" className="opacity-40" />
          </g>
        </m.g>
      </svg>
      <span className="absolute bottom-1 left-[13rem] font-hand text-base text-muted-foreground">
        your message, on its way
      </span>
    </div>
  );
}
