'use client'

import { useEffect, useState } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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

  if (state.status === "pending") {
    return (
      <div className="space-y-4 py-10 text-center">
        <h1 className="text-2xl font-semibold">Verifying payment...</h1>
        <p className="text-sm text-muted-foreground">
          Please hold on while we confirm the status of order {orderId ?? ""} with Cashfree.
        </p>
      </div>
    );
  }

  const isSuccess = state.status === "success";

  return (
    <div className="mx-auto max-w-lg space-y-6 py-10">
      <Alert variant={isSuccess ? "default" : "destructive"}>
        <AlertTitle>{isSuccess ? "Payment confirmed" : "Payment not confirmed"}</AlertTitle>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/hackathons">Browse hackathons</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
