'use client'

import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loadCashfreeDropSdk } from "@/lib/payments/cashfree-drop";

interface CashfreeDropCheckoutProps {
  paymentSessionId: string;
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onFailure?: (payload: unknown) => void;
}

export function CashfreeDropCheckout({
  paymentSessionId,
  orderId,
  amount,
  onSuccess,
  onFailure
}: CashfreeDropCheckoutProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setError(null);

      const CashfreeCtor = await loadCashfreeDropSdk();

      if (!CashfreeCtor) {
        setError("Unable to load Cashfree payment widget. Check network/settings.");
        return;
      }

      if (!containerRef.current) {
        setError("Payment container not ready.");
        return;
      }

      try {
        const cashfree = new CashfreeCtor(paymentSessionId);
        cashfree.drop(containerRef.current, {
          onSuccess: (_data) => {
            if (!cancelled) {
              onSuccess();
            }
          },
          onFailure: (payload) => {
            if (!cancelled) {
              onFailure?.(payload);
              setError("Payment was not completed. Please try again.");
            }
          }
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Cashfree drop failed", err);
          setError("Unable to initialise Cashfree checkout.");
          onFailure?.(err);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [paymentSessionId, onFailure, onSuccess]);

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          Complete the INR {amount.toFixed(0)} payment below. The secure Cashfree
          checkout is embedded directly in this window.
        </p>
        <p>
          Order reference: <span className="font-medium">{orderId}</span>
        </p>
      </div>

      <div
        ref={containerRef}
        className="min-h-[320px] rounded-lg border bg-background"
      />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Payment widget error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
