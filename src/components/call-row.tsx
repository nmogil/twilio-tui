import { colors } from "../constants";
import type { TwilioCall } from "../types";

interface CallRowProps {
  call: TwilioCall;
  selected: boolean;
}

const CALL_STATUS_COLORS: Record<string, string> = {
  completed: colors.green,
  busy: colors.orange,
  "no-answer": colors.yellow,
  canceled: colors.fgDark,
  failed: colors.red,
  ringing: colors.cyan,
  "in-progress": colors.blue,
  queued: colors.yellow,
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${mins}`;
}

function formatDuration(duration: string | null): string {
  if (!duration || duration === "0") return "--";
  const secs = parseInt(duration, 10);
  if (isNaN(secs) || secs === 0) return "--";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function CallRow({ call, selected }: CallRowProps) {
  const isInbound = call.direction.includes("inbound");
  const arrow = isInbound ? "\u2190" : "\u2192";
  const arrowColor = isInbound ? colors.cyan : colors.orange;
  const party = isInbound ? call.from : call.to;
  const date = formatDate(call.dateCreated);
  const duration = formatDuration(call.duration);
  const statusColor = CALL_STATUS_COLORS[call.status] ?? colors.fgDark;

  return (
    <box
      style={{
        flexDirection: "row",
        gap: 1,
        backgroundColor: selected ? colors.bgHighlight : undefined,
        padding: 0,
      }}
    >
      <text fg={arrowColor}>{arrow}</text>
      <text fg={colors.fg}>{party.padEnd(15)}</text>
      <text fg={colors.fgDark}>{date}</text>
      <text fg={colors.fg}>{duration.padEnd(7)}</text>
      <text fg={statusColor}>{call.status}</text>
    </box>
  );
}
