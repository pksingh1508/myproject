const DEFAULT_SITE_URL = "https://www.hackathonwallah.com";

const normalizedEnvUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  : undefined;

export const SITE_URL = normalizedEnvUrl ?? DEFAULT_SITE_URL;
export const BRAND_NAME = "HackathonWallah";
export const BRAND_TAGLINE = "Submit something. Celebrate everything.";
export const BRAND_DESCRIPTION =
  "HackathonWallah is India's home for student-led innovation. We host experiential hackathons that reward every submission, connect builders with mentors, and turn campus ideas into career-defining launches.";
export const SUPPORT_EMAIL = "hello@hackathonwallah.com";
export const SUPPORT_PHONE = "+91-98765-43210";
export const HQ_CITY = "Bengaluru";
export const HQ_COUNTRY = "India";
