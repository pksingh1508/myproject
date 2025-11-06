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
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" }
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
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />

      <div
        ref={footerRef}
        className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-[#0d0a24] px-8 py-12 shadow-[0_45px_120px_-50px_rgba(59,130,246,0.32)] sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(79,70,229,0.18),transparent_55%)]" />

          <div className="relative grid gap-10 text-sm text-muted-foreground/85 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-left text-lg font-semibold tracking-tight text-white transition-colors cursor-pointer"
                  style={brandDisplayStyle}
                >
                  HackathonWallah
                </button>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-gray-200 font-semibold">
                  Build. Submit. Win.
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Workspace 42, Indiranagar</p>
                <p>Bengaluru, Karnataka 560038</p>
                <p>India</p>
              </div>
              <div className="grid gap-1 text-sm text-gray-300">
                <p>
                  <span className="text-gray-300">Phone:</span> +91-98765-43210
                </p>
                <p>
                  <span className="text-gray-300">Email:</span>{" "}
                  hello@hackathonwallah.com
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <Column heading="Quick links" links={quickLinks} />
              <Column heading="Social" links={socialLinks} external />
              <Column heading="Legal" links={legalLinks} />
            </div>
          </div>

          <div className="relative mt-12 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground/60 sm:flex sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} HackathonWallah. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 text-muted-foreground/60">
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
        className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80"
        style={brandDisplayStyle}
      >
        {heading}
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground/60">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}





