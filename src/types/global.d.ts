declare global {
  type CashfreeDropInstance = {
    drop: (
      element: string | HTMLElement,
      options?: {
        onSuccess?: (payload: unknown) => void;
        onFailure?: (payload: unknown) => void;
        components?: Array<string | Record<string, unknown>>;
      }
    ) => void;
    redirect: () => void;
  };

  type CashfreeConstructor = new (paymentSessionId: string) => CashfreeDropInstance;

  interface Window {
    Cashfree?: CashfreeConstructor;
  }
}

export {};
