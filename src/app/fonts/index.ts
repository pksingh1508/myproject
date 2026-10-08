import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
  Kalam,
} from "next/font/google";

// Display: characterful grotesque with optical sizing for big headlines.
export const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
  display: "swap",
});

// Body & UI copy.
export const fontSans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

// Labels, numbers, metadata — the "terminal" voice of the brand.
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Handwritten margin notes. Kalam is by the Indian Type Foundry and also
// covers Devanagari, which the footer uses.
export const fontHand = Kalam({
  subsets: ["latin", "devanagari"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  fontDisplay.variable,
  fontSans.variable,
  fontMono.variable,
  fontHand.variable,
].join(" ");
