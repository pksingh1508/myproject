import { SectionLabel } from "@/components/decor/section-label";

export function NotificationsHeader({ unread }: { unread?: number }) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-8">
      <SectionLabel>inbox</SectionLabel>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] [font-stretch:92%]">
          Notifications
        </h1>
        {unread !== undefined ? (
          <span className="mb-1 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs">
            <span
              className={unread > 0 ? "size-2 rounded-full bg-signal" : "size-2 rounded-full bg-foreground/20"}
            />
            {unread > 0 ? `${unread} unread` : "all caught up"}
          </span>
        ) : null}
      </div>
      <p className="max-w-2xl leading-relaxed text-muted-foreground">
        Stay informed about registration updates, payment status changes, and
        important event announcements.
      </p>
    </header>
  );
}

export function NotificationsListSkeleton() {
  return (
    <div
      aria-label="Loading notifications"
      aria-live="polite"
      className="flex flex-col gap-3"
      role="status"
    >
      <span className="sr-only">Loading notifications...</span>
      <div className="mb-1 h-3 w-16 skeleton" />
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="grid grid-cols-[2.75rem_1fr] gap-4 rounded-[1.5rem] border border-border bg-card p-5 sm:p-6"
        >
          <div className="size-11 skeleton rounded-full" />
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="flex justify-between gap-4">
              <div className="h-4 w-2/5 skeleton" />
              <div className="h-3 w-16 skeleton" />
            </div>
            <div className="h-3.5 w-full skeleton" />
            <div className="h-3.5 w-3/4 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationsPageSkeleton() {
  return (
    <div className="container-page pb-24 pt-[calc(var(--header-h)+3rem)] sm:pt-[calc(var(--header-h)+4.5rem)]">
      <div className="mx-auto max-w-4xl">
        <NotificationsHeader />
        <div className="mt-10">
          <NotificationsListSkeleton />
        </div>
      </div>
    </div>
  );
}
