import { colors } from "../constants";
import type { TwilioDebuggerLog } from "../types";

interface LogRowProps {
  log: TwilioDebuggerLog;
  selected: boolean;
}

const LOG_LEVEL_COLORS: Record<string, string> = {
  error: colors.red,
  warning: colors.orange,
  notice: colors.yellow,
  debug: colors.fgDark,
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${mins}`;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "\u2026";
}

export function LogRow({ log, selected }: LogRowProps) {
  const levelColor = LOG_LEVEL_COLORS[log.logLevel] ?? colors.fgDark;
  const date = formatDate(log.dateGenerated || log.dateCreated);
  const level = log.logLevel.padEnd(7);
  const code = (log.errorCode || "---").padEnd(6);
  const snippet = truncate(log.alertText || "No description", 40);

  return (
    <box
      style={{
        flexDirection: "row",
        gap: 1,
        backgroundColor: selected ? colors.bgHighlight : undefined,
        padding: 0,
      }}
    >
      <text fg={colors.fgDark}>{date}</text>
      <text fg={levelColor}>{level}</text>
      <text fg={colors.fg}>{code}</text>
      <text fg={colors.fg}>{snippet}</text>
    </box>
  );
}
