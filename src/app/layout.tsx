import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./provider";
import "./globals.css";
import { SiteNavigation } from "@/components/navigation/site-navigation";
import { Toaster } from "sonner";
import ReactLenis from "lenis/react";
import { fontVariables } from "./fonts";
import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_TAGLINE,
  SITE_URL
} from "@/constants/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | India's home for student-led hackathons`,
    template: `%s | ${BRAND_NAME}`
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    "student hackathons India",
    "hackathon platform",
    "hackathonwallah",
    "college innovation challenges",
    "buildshipwin",
    "submit something celebrate everything"
  ],
  applicationName: BRAND_NAME,
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  authors: [{ name: `${BRAND_NAME} Team`, url: `${SITE_URL}/about` }],
  category: "technology",
  alternates: {
    languages: {
      "en-IN": SITE_URL,
      "en-US": SITE_URL
    }
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
        alt: `${BRAND_NAME} community of student builders`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | India's home for student-led hackathons`,
    description: BRAND_DESCRIPTION,
    images: [`${SITE_URL}/brand.png`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large"
    }
  },
  other: {
    tagline: BRAND_TAGLINE
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ReactLenis root>
          <body
            className={`${geistSans.variable} ${geistMono.variable} ${fontVariables} antialiased`}
          >
            <PostHogProvider>
              <div className="flex min-h-screen flex-col bg-background">
                <SiteNavigation />
                <main className="flex-1">
                  {children}
                  <Toaster richColors position="top-right" />
                </main>
              </div>
            </PostHogProvider>
          </body>
        </ReactLenis>
      </html>
    </ClerkProvider>
  );
}
