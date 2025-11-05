import { redirect } from "next/navigation";

import { requireUserProfile } from "@/lib/auth/require-user-profile";
import { listNotificationsForUser } from "@/lib/repos/notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Notifications | Hackathon Hub"
};

export default async function NotificationsPage() {
  try {
    const { profile } = await requireUserProfile();
    const notifications = await listNotificationsForUser({
      userId: profile.id,
      limit: 50
    });

    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay informed about registration updates, payment status changes, and important event announcements.
          </p>
        </div>
        <Separator />
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No notifications yet. Once you register or complete payments, updates will appear here.
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className="border-muted">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">
                    {notification.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
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
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Unable to load notifications:", error);
    redirect("/sign-in");
  }
}
