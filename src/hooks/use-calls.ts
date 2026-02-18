import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { listCalls } from "../twilio/calls";
import { POLL_INTERVAL_MS, ACTIVE_POLL_INTERVAL_MS } from "../constants";
import type { TwilioCall } from "../types";

const ACTIVE_STATUSES = new Set(["ringing", "in-progress", "queued"]);

export function useCalls() {
  const [calls, setCalls] = useState<TwilioCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const hasActiveCalls = useMemo(
    () => calls.some((c) => ACTIVE_STATUSES.has(c.status)),
    [calls]
  );

  const pollInterval = hasActiveCalls ? ACTIVE_POLL_INTERVAL_MS : POLL_INTERVAL_MS;

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

  const isFirstMount = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchCalls();
    }

    const interval = setInterval(fetchCalls, pollInterval);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchCalls, pollInterval]);

  return { calls, loading, error, lastRefresh, hasActiveCalls, refresh: fetchCalls };
}
