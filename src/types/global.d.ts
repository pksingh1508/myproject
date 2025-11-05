declare global {
  type CashfreeDropInstance = {
    drop: (
      element: string | HTMLElement,
      options?: {
        onSuccess?: (payload: unknown) => void;
        onFailure?: (payload: unknown) => void;
      }
    ) => void;
  };

  type CashfreeConstructor = new (paymentSessionId: string) => CashfreeDropInstance;

  interface Window {
    Cashfree?: CashfreeConstructor;
  }
}

export {};
