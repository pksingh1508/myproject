"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { RotateCcw, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NotificationsListSkeleton, NotificationsHeader } from "./notifications-loading";
import {
  NotificationList,
  NotificationsEmpty,
  type NotificationRecord,
} from "./notification-list";

type NotificationsResponse = {
  data: NotificationRecord[];
};

class NotificationsRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NotificationsRequestError";
    this.status = status;
  }
}

async function fetchNotifications(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });
  const payload = (await response.json().catch(() => null)) as
    | (NotificationsResponse & { message?: string })
    | null;

  if (!response.ok) {
    throw new NotificationsRequestError(
      payload?.message ?? "Unable to load notifications.",
      response.status,
    );
  }

  return payload?.data ?? [];
}

export function NotificationsPageClient() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(
    "/api/notifications",
    fetchNotifications,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const isUnauthorized =
    error instanceof NotificationsRequestError && error.status === 401;

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/sign-in");
    }
  }, [isUnauthorized, router]);

  const unread = data?.filter((notification) => !notification.is_read).length ?? 0;

  return (
    <div className="container-page pb-24 pt-[calc(var(--header-h)+3rem)] sm:pb-32 sm:pt-[calc(var(--header-h)+4.5rem)]">
      <div className="mx-auto max-w-4xl">
        <NotificationsHeader unread={data ? unread : undefined} />

        <div className="mt-10">
          {isLoading || isUnauthorized ? (
            <NotificationsListSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-destructive/25 bg-destructive/[0.04] px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                <WifiOff className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="font-display text-lg font-semibold tracking-tight">
                  Notifications could not be loaded
                </p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error
                    ? error.message
                    : "Please check your connection and try again."}
                </p>
              </div>
              <Button variant="outline" onClick={() => void mutate()}>
                <RotateCcw />
                Try again
              </Button>
            </div>
          ) : !data || data.length === 0 ? (
            <NotificationsEmpty />
          ) : (
            <NotificationList notifications={data} />
          )}
        </div>
      </div>
    </div>
  );
}
