'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { m } from "motion/react";

import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { SectionLabel } from "@/components/decor/section-label";
import { BrandButton } from "@/components/layout/brand-button";
import { EASE_OUT } from "@/components/motion/easing";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface CashfreeReturnHandlerProps {
  orderId: string | null;
}

type VerificationState =
  | { status: "pending" }
  | { status: "success"; message: string }
  | { status: "failed"; message: string };

export function CashfreeReturnHandler({ orderId }: CashfreeReturnHandlerProps) {
  const [state, setState] = useState<VerificationState>({ status: "pending" });

  useEffect(() => {
    if (!orderId) {
      setState({
        status: "failed",
        message: "Missing order reference. Unable to verify payment."
      });
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId })
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.message ?? "Verification failed");
        }

        const paymentStatus = payload?.data?.paymentStatus ?? "pending";

        if (cancelled) return;

        if (paymentStatus === "success") {
          setState({
            status: "success",
            message: "Payment confirmed! Your registration fee has been received."
          });
        } else if (paymentStatus === "failed") {
          setState({
            status: "failed",
            message: "Payment attempt failed. Please try again from the registration modal."
          });
        } else {
          setState({
            status: "failed",
            message: "Payment is still pending. Please wait a moment and retry verification."
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "failed",
            message:
              error instanceof Error
                ? error.message
                : "Unable to verify payment."
          });
        }
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const isSuccess = state.status === "success";
  const isPending = state.status === "pending";

  return (
    <section className="relative isolate flex min-h-[80dvh] items-center justify-center overflow-hidden px-4 pb-20 pt-[calc(var(--header-h)+3rem)]">
      <GridBackdrop spotlight />
      <div className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-8 text-center shadow-lift sm:p-10">
        <div className="mx-auto grid size-20 place-items-center">
          {isPending ? (
            <Spinner className="size-12 text-signal-ink" />
          ) : (
            <StatusGlyph success={isSuccess} />
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <SectionLabel>payment</SectionLabel>
          <h1 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.035em]">
            {isPending
              ? "Verifying payment…"
              : isSuccess
                ? "Payment confirmed"
                : "Payment not confirmed"}
          </h1>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            {isPending
              ? "Hold on while we confirm the status of your order with Cashfree."
              : state.message}
          </p>
          {orderId ? (
            <p className="rounded-full bg-foreground/[0.05] px-3 py-1 font-mono text-xs text-muted-foreground">
              order · {orderId}
            </p>
          ) : null}
        </div>

        {!isPending ? (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <BrandButton asChild arrow>
              <Link href="/hackathons">Browse hackathons</Link>
            </BrandButton>
            <BrandButton asChild variant="outline">
              <Link href="/">Return home</Link>
            </BrandButton>
          </m.div>
        ) : null}
      </div>
    </section>
  );
}

/** A check or a cross that draws itself inside a filled circle. */
function StatusGlyph({ success }: { success: boolean }) {
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.45, delay, ease: EASE_OUT },
  });

  return (
    <m.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "grid size-20 place-items-center rounded-full",
        success
          ? "bg-signal text-ink shadow-[0_0_0_10px_color-mix(in_oklch,var(--signal),transparent_82%)]"
          : "bg-destructive/12 text-destructive shadow-[0_0_0_10px_color-mix(in_oklch,var(--destructive),transparent_90%)]",
      )}
    >
      <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {success ? (
          <m.path d="M5 12.5l4.5 4.5L19 7.5" {...draw(0.2)} />
        ) : (
          <>
            <m.path d="M7 7l10 10" {...draw(0.2)} />
            <m.path d="M17 7L7 17" {...draw(0.4)} />
          </>
        )}
      </svg>
    </m.span>
  );
}
