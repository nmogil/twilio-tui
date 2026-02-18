import { useState, useCallback } from "react";
import { makeCall } from "../twilio/calls";

interface UseMakeCallOptions {
  onSuccess?: () => void;
}

export function useMakeCall({ onSuccess }: UseMakeCallOptions = {}) {
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(
    async (from: string, to: string, url: string) => {
      if (!from || !to || !url) {
        setError("From, To, and TwiML URL are all required");
        return;
      }

      setCalling(true);
      setError(null);

      const result = await makeCall(from, to, url);

      setCalling(false);

      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    },
    [onSuccess]
  );

  return { call, calling, error };
}
