import type { Metadata } from "next";

import { CashfreeReturnHandler } from "@/components/payments/cashfree-return-handler";

type CashfreeReturnPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: "Payment Verification | Hackathon Hub"
};

export default function CashfreeReturnPage({ searchParams }: CashfreeReturnPageProps) {
  const orderIdParam =
    (searchParams.order_id ?? searchParams.orderId ?? null) as string | null;

  return (
    <div className="px-4">
      <CashfreeReturnHandler orderId={orderIdParam} />
    </div>
  );
}
