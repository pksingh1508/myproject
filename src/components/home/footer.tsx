"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const quickLinks = [
  { label: "Hackathons", href: "/hackathons" },
  { label: "About", href: "/about" },
  { label: "Notifications", href: "/notifications" },
  { label: "Contact", href: "/contact" }
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/hackathon_wallah" }
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cancellation Policy", href: "/cancellation-policy" }
];

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

export function Footer() {
  const router = useRouter();
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
    const el = footerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%"
          }
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <footer
      className="relative w-full bg-background text-muted-foreground"
      style={brandSansStyle}
    >
      <div
        ref={footerRef}
        className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl border-5 border-border/80 bg-gray-50 px-8 py-12 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-lg sm:px-12">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" /> */}

          <div className="relative grid gap-10 text-sm text-muted-foreground sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-left text-2xl font-semibold tracking-tight text-foreground transition-colors"
                  style={brandDisplayStyle}
                >
                  HackathonWallah
                </button>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                  Build · Submit · Win
                </p>
              </div>
              <div className="grid gap-1 text-sm text-foreground/80">
                <p>Indranagar</p>
                <p>Gorakhpur, 273001</p>
                <p>India</p>
              </div>
              <div className="grid gap-1 text-sm text-foreground/80">
                <p>
                  <span className="font-semibold text-foreground">Email:</span>{" "}
                  hubhackathon15@gmail.com
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <Column heading="Quick links" links={quickLinks} />
              <Column heading="Social" links={socialLinks} external />
              <Column heading="Legal" links={legalLinks} />
            </div>
          </div>

          <div className="relative mt-10 grid gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex sm:items-center sm:justify-between">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} HackathonWallah. All rights reserved.
            </p>
            <p className="text-center sm:text-right text-muted-foreground">
              Crafted for makers, backed by community.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

type ColumnProps = {
  heading: string;
  links: Array<{ label: string; href: string }>;
  external?: boolean;
};

function Column({ heading, links, external }: ColumnProps) {
  return (
    <div className="space-y-3">
      <p
        className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground/70"
        style={brandDisplayStyle}
      >
        {heading}
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
