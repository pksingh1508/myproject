import { Plus_Jakarta_Sans, Sora } from "next/font/google";

export const brandSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-brand-sans",
  weight: ["400", "500", "600", "700"]
});

export const brandDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-brand-display",
  weight: ["400", "600", "700"]
});

export const fontVariables = [
  brandSans.variable,
  brandDisplay.variable
].join(" ");
