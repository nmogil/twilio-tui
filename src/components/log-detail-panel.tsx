import { colors } from "../constants";
import type { TwilioDebuggerLog, FocusZone } from "../types";

interface LogDetailPanelProps {
  log: TwilioDebuggerLog | null;
  zone: FocusZone;
}

function formatTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

const LOG_LEVEL_COLORS: Record<string, string> = {
  error: colors.red,
  warning: colors.orange,
  notice: colors.yellow,
  debug: colors.fgDark,
};

export function LogDetailPanel({ log, zone }: LogDetailPanelProps) {
  const panelFocused = zone === "log-detail";
  const borderColor = panelFocused ? colors.borderFocused : colors.border;

  if (!log) {
    return (
      <box
        title="Log Details"
        style={{
          border: true,
          borderColor: colors.border,
          width: "55%",
          flexDirection: "column",
          padding: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <text fg={colors.fgDark}>No log selected</text>
      </box>
    );
  }

  const levelColor = LOG_LEVEL_COLORS[log.logLevel] ?? colors.fgDark;

  return (
    <box
      title="Log Details"
      style={{
        border: true,
        borderColor,
        width: "55%",
        flexDirection: "column",
        gap: 1,
        padding: 1,
      }}
    >
      <box style={{ flexDirection: "row", gap: 2 }}>
        <box style={{ flexDirection: "column" }}>
          <text fg={colors.fgDark}>Severity:</text>
          <text fg={levelColor}>{log.logLevel.toUpperCase()}</text>
        </box>
        <box style={{ flexDirection: "column" }}>
          <text fg={colors.fgDark}>Error Code:</text>
          <text fg={colors.fg}>{log.errorCode || "N/A"}</text>
        </box>
      </box>
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Alert Text:</text>
        <text fg={colors.fg}>{log.alertText || "No description"}</text>
      </box>
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>More Info:</text>
        <text fg={colors.cyan}>{log.moreInfo || "N/A"}</text>
      </box>
      <box style={{ flexDirection: "row", gap: 2 }}>
        <box style={{ flexDirection: "column" }}>
          <text fg={colors.fgDark}>Request Method:</text>
          <text fg={colors.fg}>{log.requestMethod || "N/A"}</text>
        </box>
        <box style={{ flexDirection: "column" }}>
          <text fg={colors.fgDark}>Request URL:</text>
          <text fg={colors.fg}>{log.requestUrl || "N/A"}</text>
        </box>
      </box>
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Resource SID:</text>
        <text fg={colors.fgDark}>{log.resourceSid || "N/A"}</text>
      </box>
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Generated:</text>
        <text fg={colors.fg}>{formatTimestamp(log.dateGenerated || log.dateCreated)}</text>
      </box>
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Alert SID:</text>
        <text fg={colors.fgDark}>{log.sid}</text>
      </box>
      <box style={{ flexGrow: 1 }} />
      <text fg={colors.fgDark}>Tab to switch panes | Esc to tabs</text>
    </box>
  );
}
