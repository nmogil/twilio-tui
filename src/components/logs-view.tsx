import { useState, useEffect, useRef } from "react";
import { useLogFilters } from "../hooks/use-log-filters";
import { LogToolbar } from "./log-toolbar";
import { LogList } from "./log-list";
import { LogDetailPanel } from "./log-detail-panel";
import type { TwilioDebuggerLog, FocusZone } from "../types";

interface LogsViewProps {
  logs: TwilioDebuggerLog[];
  logsLoading: boolean;
  logsError: string | null;
  zone: FocusZone;
  onFastRefreshChange: (fast: boolean) => void;
}

export function LogsView({
  logs,
  logsLoading,
  logsError,
  zone,
  onFastRefreshChange,
}: LogsViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    filteredLogs,
    levelFilter,
    searchQuery,
    autoScroll,
    fastRefresh,
    cycleLevel,
    setSearchQuery,
    toggleAutoScroll,
    toggleFastRefresh,
    totalCount,
    filteredCount,
  } = useLogFilters(logs);

  const selectedLog = filteredLogs[selectedIndex] ?? null;

  // Bubble fastRefresh changes up to parent
  const prevFastRef = useRef(fastRefresh);
  useEffect(() => {
    if (prevFastRef.current !== fastRefresh) {
      prevFastRef.current = fastRefresh;
      onFastRefreshChange(fastRefresh);
    }
  }, [fastRefresh, onFastRefreshChange]);

  // Auto-scroll: reset selectedIndex to 0 when filteredLogs changes
  const prevFilteredLenRef = useRef(filteredLogs.length);
  useEffect(() => {
    if (autoScroll && filteredLogs.length !== prevFilteredLenRef.current) {
      setSelectedIndex(0);
    }
    prevFilteredLenRef.current = filteredLogs.length;
  }, [filteredLogs, autoScroll]);

  // Clamp selectedIndex when filteredLogs shrinks
  useEffect(() => {
    if (selectedIndex >= filteredLogs.length && filteredLogs.length > 0) {
      setSelectedIndex(filteredLogs.length - 1);
    }
  }, [filteredLogs.length, selectedIndex]);

  return (
    <box style={{ flexDirection: "column", flexGrow: 1 }}>
      <LogToolbar
        levelFilter={levelFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        autoScroll={autoScroll}
        fastRefresh={fastRefresh}
        filteredCount={filteredCount}
        totalCount={totalCount}
        zone={zone}
      />
      <box style={{ flexDirection: "row", flexGrow: 1 }}>
        <LogList
          logs={filteredLogs}
          loading={logsLoading}
          error={logsError}
          focused={zone === "log-list"}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={setSelectedIndex}
          onCycleLevel={cycleLevel}
          onToggleAutoScroll={toggleAutoScroll}
          onToggleFastRefresh={toggleFastRefresh}
        />
        <LogDetailPanel log={selectedLog} zone={zone} />
      </box>
    </box>
  );
}
