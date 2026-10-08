import { format } from "date-fns";

import type { Hackathon } from "@/types/database";

export type RegistrationTone = "open" | "soon" | "closed" | "done";

export type RegistrationState = {
  label: string;
  tone: RegistrationTone;
};

function safeDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string, pattern = "MMM d, yyyy") {
  const date = safeDate(value);
  return date ? format(date, pattern) : value;
}

export function formatDateRange(start: string, end: string) {
  const startDate = safeDate(start);
  const endDate = safeDate(end);
  if (!startDate || !endDate) return `${start} – ${end}`;

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startLabel = format(startDate, sameYear ? "MMM d" : "MMM d, yyyy");
  const endLabel = format(endDate, "MMM d, yyyy");

  return startLabel === format(endDate, sameYear ? "MMM d" : "MMM d, yyyy")
    ? endLabel
    : `${startLabel} – ${endLabel}`;
}

export function formatInr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Where a hackathon's registration window stands right now. */
export function getRegistrationState(
  hackathon: Hackathon,
  now = new Date(),
): RegistrationState | null {
  if (hackathon.status === "completed") {
    return { label: "Completed", tone: "done" };
  }

  const opens = safeDate(hackathon.registration_start);
  const closes = safeDate(hackathon.registration_end);
  if (!opens || !closes) return null;

  if (now > closes) {
    return { label: `Registration closed ${format(closes, "MMM d")}`, tone: "closed" };
  }

  if (now < opens) {
    return { label: `Opens ${format(opens, "MMM d")}`, tone: "soon" };
  }

  return { label: "Registration open", tone: "open" };
}

/** Small, stable string hash used to give each hackathon its own cover. */
export function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
