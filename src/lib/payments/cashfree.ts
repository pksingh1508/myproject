import { Cashfree, CFEnvironment } from "cashfree-pg";

let cachedClient: Cashfree | null = null;

function resolveEnvironment() {
  const env = process.env.NEXT_PUBLIC_CASHFREE_ENV ?? "sandbox";
  return env.toLowerCase() === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;
}

export function getCashfreeClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    throw new Error(
      "Cashfree credentials are missing. Ensure CASHFREE_APP_ID and CASHFREE_SECRET_KEY are set."
    );
  }

  cachedClient = new Cashfree(resolveEnvironment(), appId, secretKey);
  return cachedClient;
}
