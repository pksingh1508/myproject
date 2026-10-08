"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight, Check, Copy, MapPin } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { useMotionFactor } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "hubhackathon15@gmail.com";

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "Hackathons", href: "/hackathons" },
      { label: "Notifications", href: "/notifications" },
      { label: "Career", href: "/career" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      {
        label: "Instagram",
        href: "https://instagram.com/hackathon_wallah",
        external: true,
      },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
    ],
  },
] as const;

const HIDDEN_ON = ["/sign-in", "/sign-up"];

export function SiteFooter() {
  const pathname = usePathname();

  if (HIDDEN_ON.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  return <FooterContent />;
}

function FooterContent() {
  const footerRef = useRef<HTMLElement>(null);
  const factor = useMotionFactor();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => `${(1 - progress) * 45 * f}%`,
  );

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative isolate overflow-hidden bg-ink text-paper dark:border-t dark:border-border dark:bg-[oklch(0.14_0.03_258)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-graph mask-fade-b [--grid-line:oklch(1_0_0/0.05)]"
      />
      <div
        aria-hidden
        className="absolute -right-40 -top-40 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.737_0.163_137/0.14),transparent_65%)]"
      />

      <div className="container-page pb-12 pt-20 sm:pt-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-7 lg:col-span-5">
            <BrandLogo tone="light" />
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-paper/65">
              India&apos;s home for student-led hackathons — made for builders
              from every campus, not just the famous few.
            </p>
            <div className="flex flex-col gap-3">
              <CopyEmail email={CONTACT_EMAIL} />
              <p className="flex items-center gap-2 text-sm text-paper/55">
                <MapPin className="size-4 text-hilite" aria-hidden />
                Noida, Sector 62, India
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7"
          >
            {columns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <p className="font-mono text-xs lowercase text-paper/45">
                  <span className="text-hilite">{"// "}</span>
                  {column.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => {
                    const external = "external" in link && link.external;
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                          className="group/link inline-flex items-center gap-1 text-[0.95rem] text-paper/80 transition-colors duration-300 hover:text-paper"
                        >
                          <span className="relative">
                            {link.label}
                            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-hilite transition-transform duration-500 ease-out-quint group-hover/link:origin-left group-hover/link:scale-x-100" />
                          </span>
                          {external ? (
                            <ArrowUpRight className="size-3.5 text-paper/50 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="relative overflow-hidden" aria-hidden>
        <m.p
          style={{ y: wordmarkY }}
          className="container-page select-none whitespace-nowrap text-center font-display text-[13.4vw] font-bold leading-[0.78] tracking-[-0.055em] text-transparent [-webkit-text-stroke:1px_oklch(1_0_0/0.16)] [font-stretch:80%] lg:text-[11.6rem]"
        >
          Hackathon<span className="[-webkit-text-stroke:1px_oklch(0.88_0.17_128/0.55)]">Wallah</span>
        </m.p>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            © {new Date().getFullYear()} HackathonWallah. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2">
              Crafted for makers, backed by community
              <span className="font-hand text-[0.95rem] leading-none text-hilite">
                · हैकाथॉन वाला
              </span>
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="group/top inline-flex items-center gap-1.5 rounded-full border border-paper/15 px-3 py-1.5 text-paper/70 transition-colors hover:border-paper/40 hover:text-paper"
            >
              <ArrowUp className="size-3.5 transition-transform duration-300 group-hover/top:-translate-y-0.5" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`mailto:${email}`}
        className="font-display text-lg font-medium tracking-tight text-paper underline decoration-paper/25 underline-offset-[6px] transition-colors hover:decoration-hilite"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className={cn(
          "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 font-mono text-[0.7rem] transition-colors",
          copied
            ? "border-hilite/60 text-hilite"
            : "border-paper/15 text-paper/60 hover:border-paper/40 hover:text-paper",
        )}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
