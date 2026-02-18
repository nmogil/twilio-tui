import { useState } from "react";
import { LogList } from "./log-list";
import { LogDetailPanel } from "./log-detail-panel";
import type { TwilioDebuggerLog, FocusZone } from "../types";

interface LogsViewProps {
  logs: TwilioDebuggerLog[];
  logsLoading: boolean;
  logsError: string | null;
  zone: FocusZone;
}

export function LogsView({ logs, logsLoading, logsError, zone }: LogsViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedLog = logs[selectedIndex] ?? null;

  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <LogList
        logs={logs}
        loading={logsLoading}
        error={logsError}
        focused={zone === "log-list"}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
      />
      <LogDetailPanel log={selectedLog} zone={zone} />
    </box>
  );
}
