import type { Metadata } from "next";
import { BRAND_NAME } from "@/constants/site";

import { NotificationsPageClient } from "./notifications-page-client";

export const metadata: Metadata = {
  title: `Notifications | ${BRAND_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}
