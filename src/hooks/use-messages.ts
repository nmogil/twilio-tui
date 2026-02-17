import { useState, useEffect, useCallback, useRef } from "react";
import { listMessages } from "../twilio/messages";
import { POLL_INTERVAL_MS } from "../constants";
import type { TwilioMessage } from "../types";

export function useMessages() {
  const [messages, setMessages] = useState<TwilioMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetchMessages = useCallback(async () => {
    const result = await listMessages();
    if (!mountedRef.current) return;

    if (result.ok) {
      setMessages(result.data);
      setError(null);
      setLastRefresh(new Date());
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchMessages();

    const interval = setInterval(fetchMessages, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchMessages]);

  return { messages, loading, error, lastRefresh, refresh: fetchMessages };
}
