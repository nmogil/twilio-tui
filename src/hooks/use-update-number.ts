import { useState, useCallback } from "react";
import { updatePhoneNumber } from "../twilio/phone-numbers";

interface UseUpdateNumberOptions {
  onSuccess?: () => void;
}

export function useUpdateNumber({ onSuccess }: UseUpdateNumberOptions = {}) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (
      sid: string,
      updates: { friendlyName?: string; voiceUrl?: string; smsUrl?: string }
    ) => {
      if (!sid) {
        setError("No number selected");
        return;
      }

      setUpdating(true);
      setError(null);

      const result = await updatePhoneNumber(sid, updates);

      setUpdating(false);

      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    },
    [onSuccess]
  );

  return { update, updating, error };
}
