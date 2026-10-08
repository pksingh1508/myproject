"use client";

import Link from "next/link";
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
import {
  ArrowRight,
  Bell,
  CircleCheck,
  Info,
  OctagonX,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { BrandButton } from "@/components/layout/brand-button";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  action_url: string | null;
  created_at: string;
};

const TYPE_STYLES: Record<NotificationRecord["type"], { icon: LucideIcon; tone: string }> = {
  info: { icon: Info, tone: "bg-brand/12 text-brand" },
  success: { icon: CircleCheck, tone: "bg-signal/20 text-signal-ink" },
  warning: { icon: TriangleAlert, tone: "bg-marigold/25 text-marigold-ink" },
  error: { icon: OctagonX, tone: "bg-destructive/12 text-destructive" },
};

function groupLabel(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return "Earlier";
}

function groupNotifications(notifications: NotificationRecord[]) {
  const groups = new Map<string, NotificationRecord[]>();
  for (const notification of notifications) {
    const date = new Date(notification.created_at);
    const label = Number.isNaN(date.getTime()) ? "Earlier" : groupLabel(date);
    groups.set(label, [...(groups.get(label) ?? []), notification]);
  }
  return Array.from(groups.entries());
}

export function NotificationList({ notifications }: { notifications: NotificationRecord[] }) {
  return (
    <div className="flex flex-col gap-10">
      {groupNotifications(notifications).map(([label, items]) => (
        <section key={label} aria-label={label} className="flex flex-col gap-3">
          <p className="font-mono text-[0.72rem] lowercase text-muted-foreground">
            <span className="text-signal-ink">{"// "}</span>
            {label}
          </p>
          <Stagger className="flex flex-col gap-3" stagger={0.06}>
            {items.map((notification) => (
              <StaggerItem key={notification.id} y={16}>
                <NotificationItem notification={notification} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
    </div>
  );
}

function NotificationItem({ notification }: { notification: NotificationRecord }) {
  const { icon: Icon, tone } = TYPE_STYLES[notification.type] ?? TYPE_STYLES.info;
  const date = new Date(notification.created_at);
  const valid = !Number.isNaN(date.getTime());

  return (
    <article
      className={cn(
        "grid grid-cols-[2.75rem_1fr] gap-4 rounded-[1.5rem] border bg-card p-5 transition-[border-color,box-shadow] duration-300 hover:shadow-soft sm:p-6",
        notification.is_read ? "border-border" : "border-foreground/15 shadow-soft",
      )}
    >
      <span className={cn("grid size-11 place-items-center rounded-full", tone)}>
        <Icon className="size-[1.15rem]" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="flex items-center gap-2 font-display text-[1.08rem] font-semibold leading-snug tracking-[-0.015em]">
            {!notification.is_read ? (
              <span className="size-2 shrink-0 rounded-full bg-signal" aria-label="Unread" />
            ) : null}
            {notification.title}
          </h3>
          {valid ? (
            <time
              dateTime={notification.created_at}
              title={format(date, "PPpp")}
              className="font-mono text-[0.72rem] text-muted-foreground"
            >
              {formatDistanceToNowStrict(date, { addSuffix: true })}
            </time>
          ) : null}
        </div>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">
          {notification.message}
        </p>
        {notification.action_url ? (
          <a
            href={notification.action_url}
            className="group/action mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand"
          >
            Take action
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/action:translate-x-0.5" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

/** A sleepy bell for when there's nothing to report. */
export function NotificationsEmpty() {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-[1.75rem] border border-dashed border-foreground/20 bg-card/60 px-6 py-16 text-center">
      <div aria-hidden className="absolute inset-0 bg-graph mask-fade-edges" />
      <div className="relative">
        <span className="relative grid size-20 place-items-center rounded-full border border-border bg-background shadow-soft">
          <Bell className="size-8 -rotate-12 text-foreground/70" strokeWidth={1.6} />
          <span className="absolute -right-6 -top-5 font-hand text-xl font-bold text-brand">
            z<span className="text-base">z</span>
            <span className="text-sm">z</span>
          </span>
        </span>
      </div>
      <h2 className="relative mt-7 font-display text-2xl font-semibold tracking-[-0.03em]">
        All quiet for now
      </h2>
      <p className="relative mt-2 max-w-sm leading-relaxed text-muted-foreground">
        Once you register or complete payments, updates will appear here.
      </p>
      <BrandButton asChild arrow className="relative mt-7">
        <Link href="/hackathons">Find a hackathon</Link>
      </BrandButton>
    </div>
  );
}
