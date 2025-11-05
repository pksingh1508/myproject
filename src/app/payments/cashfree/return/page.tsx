import type { Metadata } from "next";

import { CashfreeReturnHandler } from "@/components/payments/cashfree-return-handler";

type CashfreeReturnPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Payment Verification | Hackathon Hub"
};

export default async function CashfreeReturnPage({
  searchParams
}: CashfreeReturnPageProps) {
  const params = await searchParams;
  const orderIdParam =
    (params.order_id ?? params.orderId ?? null) as string | null;

  return (
    <div className="px-4">
      <CashfreeReturnHandler orderId={orderIdParam} />
    </div>
  );
}
