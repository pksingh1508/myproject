import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NotificationsListSkeleton() {
  return (
    <div
      aria-label="Loading notifications"
      aria-live="polite"
      className="space-y-4"
      role="status"
    >
      <span className="sr-only">Loading notifications...</span>
      {Array.from({ length: 3 }, (_, index) => (
        <Card
          key={index}
          movingBorder={false}
          aria-hidden="true"
          className="border-muted"
        >
          <CardHeader className="space-y-3">
            <div className="h-5 w-2/5 animate-pulse rounded bg-muted motion-reduce:animate-none" />
            <div className="h-3 w-28 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function NotificationsPageSkeleton() {
  return (
    <div
      data-moving-border-scope="off"
      className="mx-auto max-w-4xl space-y-6 px-4 py-10"
    >
      <div className="space-y-3">
        <div className="h-9 w-56 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted motion-reduce:animate-none" />
      </div>
      <div className="h-px bg-border" />
      <NotificationsListSkeleton />
    </div>
  );
}
