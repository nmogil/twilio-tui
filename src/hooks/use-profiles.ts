import { useState, useEffect, useCallback, useRef } from "react";
import { listProfiles, fetchBalance, listUsageRecords } from "../twilio/accounts";
import { ACCOUNT_POLL_INTERVAL_MS } from "../constants";
import type { TwilioProfile, TwilioBalance, TwilioUsageRecord } from "../types";

export function useProfiles() {
  const [profiles, setProfiles] = useState<TwilioProfile[]>([]);
  const [balance, setBalance] = useState<TwilioBalance | null>(null);
  const [usage, setUsage] = useState<TwilioUsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    const [profilesResult, balanceResult, usageResult] = await Promise.all([
      listProfiles(),
      fetchBalance(),
      listUsageRecords(),
    ]);

    if (!mountedRef.current) return;

    if (profilesResult.ok) {
      setProfiles(profilesResult.data);
      setError(null);
      setLastRefresh(new Date());
    } else {
      setError(profilesResult.error);
    }

    // Balance and usage are nice-to-have; don't set error if only these fail
    if (balanceResult.ok) {
      setBalance(balanceResult.data);
    } else {
      setBalance(null);
    }

    if (usageResult.ok) {
      setUsage(usageResult.data);
    } else {
      setUsage([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();

    const interval = setInterval(fetchAll, ACCOUNT_POLL_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchAll]);

  return { profiles, balance, usage, loading, error, lastRefresh, refresh: fetchAll };
}
