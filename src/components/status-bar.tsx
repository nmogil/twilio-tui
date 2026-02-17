import { colors } from "../constants";

interface StatusBarProps {
  lastRefresh: Date | null;
  sending: boolean;
  error: string | null;
}

function formatTime(d: Date): string {
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  const secs = String(d.getSeconds()).padStart(2, "0");
  return `${hours}:${mins}:${secs}`;
}

export function StatusBar({ lastRefresh, sending, error }: StatusBarProps) {
  const refreshText = lastRefresh
    ? `Last refresh: ${formatTime(lastRefresh)}`
    : "Loading...";

  return (
    <box
      style={{
        flexDirection: "row",
        gap: 2,
        backgroundColor: colors.bgDark,
        padding: 0,
      }}
    >
      <text fg={colors.green}>{"\u25CF"} Connected</text>
      <text fg={colors.fgDark}>{refreshText}</text>
      {sending && <text fg={colors.yellow}>Sending...</text>}
      {error && <text fg={colors.red}>{error}</text>}
      <text fg={colors.fgDark}>
        Tab:focus | Esc:tabs | Ctrl+Enter:send | Ctrl+C:quit
      </text>
    </box>
  );
}
