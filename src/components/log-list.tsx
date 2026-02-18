import { useKeyboard } from "@opentui/react";
import { LogRow } from "./log-row";
import { colors } from "../constants";
import type { TwilioDebuggerLog } from "../types";

interface LogListProps {
  logs: TwilioDebuggerLog[];
  loading: boolean;
  error: string | null;
  focused: boolean;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  onCycleLevel?: () => void;
  onToggleAutoScroll?: () => void;
  onToggleFastRefresh?: () => void;
}

export function LogList({
  logs,
  loading,
  error,
  focused,
  selectedIndex,
  onSelectedIndexChange,
  onCycleLevel,
  onToggleAutoScroll,
  onToggleFastRefresh,
}: LogListProps) {
  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      onSelectedIndexChange(Math.min(selectedIndex + 1, logs.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
    } else if (key.name === "f") {
      onCycleLevel?.();
    } else if (key.name === "a") {
      onToggleAutoScroll?.();
    } else if (key.name === "r") {
      onToggleFastRefresh?.();
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (loading && logs.length === 0) {
    return (
      <box
        title="Debugger Logs"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>Loading logs...</text>
      </box>
    );
  }

  if (error && logs.length === 0) {
    return (
      <box
        title="Debugger Logs"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.red}>Error: {error}</text>
      </box>
    );
  }

  if (logs.length === 0) {
    return (
      <box
        title="Debugger Logs"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No debugger logs found</text>
      </box>
    );
  }

  return (
    <box
      title="Debugger Logs"
      style={{
        border: true,
        borderColor,
        flexGrow: 1,
      }}
    >
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {logs.map((log, i) => (
          <LogRow key={log.sid} log={log} selected={i === selectedIndex} />
        ))}
      </scrollbox>
    </box>
  );
}
