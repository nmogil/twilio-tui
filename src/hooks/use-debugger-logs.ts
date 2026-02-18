import { useState, useEffect, useCallback, useRef } from "react";
import { listDebuggerLogs } from "../twilio/debugger";
import { POLL_INTERVAL_MS } from "../constants";
import type { TwilioDebuggerLog } from "../types";

export function useDebuggerLogs(pollInterval?: number) {
  const [logs, setLogs] = useState<TwilioDebuggerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const interval = pollInterval ?? POLL_INTERVAL_MS;

  const fetchLogs = useCallback(async () => {
    const result = await listDebuggerLogs();
    if (!mountedRef.current) return;

    if (result.ok) {
      setLogs(result.data);
      setError(null);
      setLastRefresh(new Date());
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchLogs();

    const id = setInterval(fetchLogs, interval);

    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchLogs, interval]);

  return { logs, loading, error, lastRefresh, refresh: fetchLogs };
}
