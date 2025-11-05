import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./provider";
import "./globals.css";
import { SiteNavigation } from "@/components/navigation/site-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Hackathon Hub",
    template: "%s | Hackathon Hub"
  },
  description:
    "Discover, join, and manage hackathons seamlessly with secure authentication and streamlined participant flows."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PostHogProvider>
            <div className="flex min-h-screen flex-col bg-background">
              <SiteNavigation />
              <main className="flex-1">{children}</main>
            </div>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
