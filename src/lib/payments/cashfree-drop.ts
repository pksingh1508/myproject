const SDK_VERSION = "2.0.0";

function getCashfreeScriptUrl() {
  const env = (process.env.NEXT_PUBLIC_CASHFREE_ENV ?? "sandbox").toLowerCase();
  if (env === "production" || env === "prod" || env === "live") {
    return `https://sdk.cashfree.com/js/ui/${SDK_VERSION}/cashfree.prod.js`;
  }
  return `https://sdk.cashfree.com/js/ui/${SDK_VERSION}/cashfree.sandbox.js`;
}

let cashfreePromise: Promise<CashfreeConstructor | null> | null = null;

export function loadCashfreeDropSdk(): Promise<CashfreeConstructor | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.Cashfree) {
    return Promise.resolve(window.Cashfree);
  }

  if (cashfreePromise) {
    return cashfreePromise;
  }

  cashfreePromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-cashfree="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(window.Cashfree ?? null);
      });
      existingScript.addEventListener("error", (event) => {
        console.error("Cashfree SDK failed to load", event);
        resolve(null);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = getCashfreeScriptUrl();
    script.async = true;
    script.defer = true;
    script.dataset.cashfree = "true";
    script.onload = () => resolve(window.Cashfree ?? null);
    script.onerror = (event) => {
      console.error("Cashfree SDK failed to load", event);
      resolve(null);
    };

    document.head.appendChild(script);
  });

  return cashfreePromise;
}
