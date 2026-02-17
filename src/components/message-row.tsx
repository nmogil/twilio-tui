import { colors } from "../constants";
import type { TwilioMessage } from "../types";

interface MessageRowProps {
  message: TwilioMessage;
  selected: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  delivered: colors.green,
  sent: colors.blue,
  received: colors.cyan,
  failed: colors.red,
  undelivered: colors.red,
  queued: colors.yellow,
  sending: colors.orange,
};

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + "\u2026";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${mins}`;
}

export function MessageRow({ message, selected }: MessageRowProps) {
  const isInbound = message.direction.includes("inbound");
  const arrow = isInbound ? "\u2190" : "\u2192";
  const arrowColor = isInbound ? colors.cyan : colors.orange;
  const party = isInbound ? message.from : message.to;
  const date = formatDate(message.dateCreated);
  const body = truncate(message.body.replace(/\n/g, " "), 40);
  const statusColor = STATUS_COLORS[message.status] ?? colors.fgDark;

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
      <text fg={colors.fg}>{body}</text>
      <text fg={statusColor}>{message.status}</text>
    </box>
  );
}
