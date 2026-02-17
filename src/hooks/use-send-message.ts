import { useState, useCallback } from "react";
import { sendMessage } from "../twilio/messages";

interface UseSendMessageOptions {
  onSuccess?: () => void;
}

export function useSendMessage({ onSuccess }: UseSendMessageOptions = {}) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (from: string, to: string, body: string) => {
      if (!from || !to || !body) {
        setError("From, To, and Body are all required");
        return;
      }

      setSending(true);
      setError(null);

      const result = await sendMessage(from, to, body);

      setSending(false);

      if (result.ok) {
        onSuccess?.();
      } else {
        setError(result.error);
      }
    },
    [onSuccess]
  );

  return { send, sending, error };
}
