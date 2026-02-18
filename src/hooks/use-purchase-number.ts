import { useState, useCallback } from "react";
import { purchasePhoneNumber } from "../twilio/phone-numbers";

interface UsePurchaseNumberOptions {
  onSuccess?: () => void;
}

export function usePurchaseNumber({ onSuccess }: UsePurchaseNumberOptions = {}) {
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(
    async (phoneNumber: string) => {
      if (!phoneNumber) {
        setError("No phone number specified");
        return;
      }
      setPurchasing(true);
      setError(null);
      const result = await purchasePhoneNumber(phoneNumber);
      setPurchasing(false);
      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    },
    [onSuccess]
  );

  return { purchase, purchasing, error };
}
