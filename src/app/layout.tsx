import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import ReactLenis from "lenis/react";

import { PostHogProvider } from "./provider";
import "./globals.css";
import { fontVariables } from "./fonts";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_TAGLINE,
  SITE_URL,
} from "@/constants/site";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | India's home for student-led hackathons`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    "student hackathons India",
    "hackathon platform",
    "hackathonwallah",
    "college innovation challenges",
    "buildshipwin",
    "submit something celebrate everything",
  ],
  applicationName: BRAND_NAME,
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  authors: [{ name: `${BRAND_NAME} Team`, url: `${SITE_URL}/about` }],
  category: "technology",
  alternates: {
    languages: {
      "en-IN": SITE_URL,
      "en-US": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${BRAND_NAME} | India's home for student-led hackathons`,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/brand.png`,
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} community of student builders`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | India's home for student-led hackathons`,
    description: BRAND_DESCRIPTION,
    images: [`${SITE_URL}/brand.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  other: {
    tagline: BRAND_TAGLINE,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1424" },
  ],
};

const clerkFont = "var(--font-hanken), ui-sans-serif, system-ui, sans-serif";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "var(--card)",
          colorForeground: "var(--card-foreground)",
          colorMuted: "var(--muted)",
          colorMutedForeground: "var(--muted-foreground)",
          colorNeutral: "var(--foreground)",
          colorInput: "var(--background)",
          colorInputForeground: "var(--foreground)",
          colorPrimary: "var(--primary)",
          colorPrimaryForeground: "var(--primary-foreground)",
          colorBorder: "var(--border)",
          colorRing: "var(--ring)",
          colorDanger: "var(--destructive)",
          colorSuccess: "var(--signal-ink)",
          fontFamily: clerkFont,
          fontFamilyButtons: clerkFont,
          borderRadius: "0.75rem",
        },
        elements: {
          cardBox: "shadow-lift rounded-[1.5rem] border border-border",
          headerTitle: "font-display text-2xl tracking-tight",
          formButtonPrimary: "rounded-full shadow-none",
          socialButtonsBlockButton: "rounded-full",
          footerActionLink: "text-brand",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={fontVariables}>
        <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -96 } }}>
          <body>
            <ThemeProvider>
              <MotionProvider>
                <PostHogProvider>
                  <a
                    href="#main"
                    className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lift transition-transform focus-visible:translate-y-0"
                  >
                    Skip to content
                  </a>
                  <SiteNavigation />
                  <div className="relative flex min-h-dvh flex-col">
                    <main id="main" className="flex-1">
                      {children}
                    </main>
                    <SiteFooter />
                  </div>
                  <Toaster position="bottom-right" />
                </PostHogProvider>
              </MotionProvider>
            </ThemeProvider>
            <Analytics />
          </body>
        </ReactLenis>
      </html>
    </ClerkProvider>
  );
}
