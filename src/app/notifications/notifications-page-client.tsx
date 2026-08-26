"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { NotificationsListSkeleton } from "./notifications-loading";

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  action_url: string | null;
  created_at: string;
};

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

  return (
    <div
      data-moving-border-scope="off"
      className="mx-auto max-w-4xl space-y-6 px-4 py-10"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Stay informed about registration updates, payment status changes, and
          important event announcements.
        </p>
      </div>
      <Separator />

      {isLoading || isUnauthorized ? (
        <NotificationsListSkeleton />
      ) : error ? (
        <Card movingBorder={false} className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                Notifications could not be loaded
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Please check your connection and try again."}
              </p>
            </div>
            <Button variant="outline" onClick={() => void mutate()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : data?.length === 0 ? (
        <Card movingBorder={false}>
          <CardContent className="py-10 text-center text-muted-foreground">
            No notifications yet. Once you register or complete payments,
            updates will appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.map((notification) => (
            <Card
              key={notification.id}
              movingBorder={false}
              className="border-muted"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-base">
                  {notification.title}
                </CardTitle>
                <time
                  className="shrink-0 text-xs text-muted-foreground"
                  dateTime={notification.created_at}
                >
                  {new Date(notification.created_at).toLocaleString()}
                </time>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{notification.message}</p>
                {notification.action_url ? (
                  <a
                    href={notification.action_url}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Take action
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
