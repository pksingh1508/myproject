"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandButton } from "@/components/layout";

const quickLinks = [
  { label: "Upcoming hackathons", href: "/hackathons" },
  { label: "FAQ", href: "/#faq" },
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
  { label: "Terms of service", href: "/legal/terms" },
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Cookies policy", href: "/legal/cookies" }
];

export function Footer() {
  const router = useRouter();

  return (
    <footer className="relative w-full bg-background text-muted-foreground">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-border/40 bg-[#05030f] px-8 py-12 shadow-[0_50px_120px_-40px_rgba(59,130,246,0.3)] sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.15),transparent_55%)]" />
          <div className="relative grid gap-10 text-sm text-muted-foreground/90 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <div>
                <span className="text-lg font-semibold tracking-tight text-white">
                  HackathonWallah
                </span>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary/70">
                  Build. Submit. Win.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Workspace 42, Indiranagar</p>
                <p>Bengaluru, Karnataka 560038</p>
                <p>India</p>
              </div>
              <div className="grid gap-1 text-sm text-muted-foreground/80">
                <p>
                  <span className="text-muted-foreground/50">Phone:</span>{" "}
                  +91-98765-43210
                </p>
                <p>
                  <span className="text-muted-foreground/50">Email:</span>{" "}
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
              © {new Date().getFullYear()} HackathonWallah. All rights reserved.
            </p>
            <p className="mt-2 sm:mt-0">
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
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
        {heading}
      </p>
      <ul className="space-y-2 text-sm text-muted-foreground/80">
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

