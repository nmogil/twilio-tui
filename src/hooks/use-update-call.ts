import { useState, useCallback } from "react";
import { updateCall } from "../twilio/calls";
import type { CallUpdateParams } from "../types";

interface UseUpdateCallOptions {
  onSuccess?: () => void;
}

export function useUpdateCall({ onSuccess }: UseUpdateCallOptions = {}) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (sid: string, params: CallUpdateParams) => {
      if (!sid) {
        setError("No call selected");
        return;
      }

      setUpdating(true);
      setError(null);

      const result = await updateCall(sid, params);

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
