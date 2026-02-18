import { useState, useMemo, useCallback } from "react";
import type { TwilioDebuggerLog } from "../types";

const LEVEL_CYCLE = ["all", "error", "warning", "notice", "debug"] as const;
type LogLevel = (typeof LEVEL_CYCLE)[number];

export function useLogFilters(logs: TwilioDebuggerLog[]) {
  const [levelFilter, setLevelFilter] = useState<LogLevel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(false);
  const [fastRefresh, setFastRefresh] = useState(false);

  const cycleLevel = useCallback(() => {
    setLevelFilter((current) => {
      const idx = LEVEL_CYCLE.indexOf(current);
      return LEVEL_CYCLE[(idx + 1) % LEVEL_CYCLE.length];
    });
  }, []);

  const toggleAutoScroll = useCallback(() => {
    setAutoScroll((v) => !v);
  }, []);

  const toggleFastRefresh = useCallback(() => {
    setFastRefresh((v) => !v);
  }, []);

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (levelFilter !== "all") {
      result = result.filter((log) => log.logLevel === levelFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          (log.alertText && log.alertText.toLowerCase().includes(q)) ||
          (log.errorCode && log.errorCode.toLowerCase().includes(q)) ||
          (log.requestUrl && log.requestUrl.toLowerCase().includes(q))
      );
    }

    return result;
  }, [logs, levelFilter, searchQuery]);

  return {
    filteredLogs,
    levelFilter,
    searchQuery,
    autoScroll,
    fastRefresh,
    cycleLevel,
    setSearchQuery,
    toggleAutoScroll,
    toggleFastRefresh,
    totalCount: logs.length,
    filteredCount: filteredLogs.length,
  };
}
