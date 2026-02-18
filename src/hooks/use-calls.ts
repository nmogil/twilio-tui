import { useState, useEffect, useCallback, useRef } from "react";
import { listCalls } from "../twilio/calls";
import { POLL_INTERVAL_MS } from "../constants";
import type { TwilioCall } from "../types";

export function useCalls() {
  const [calls, setCalls] = useState<TwilioCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetchCalls = useCallback(async () => {
    const result = await listCalls();
    if (!mountedRef.current) return;

    if (result.ok) {
      setCalls(result.data);
      setError(null);
      setLastRefresh(new Date());
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchCalls();

    const interval = setInterval(fetchCalls, POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchCalls]);

  return { calls, loading, error, lastRefresh, refresh: fetchCalls };
}
