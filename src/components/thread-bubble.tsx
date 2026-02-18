import { colors } from "../constants";
import type { TwilioMessage } from "../types";

interface ThreadBubbleProps {
  message: TwilioMessage;
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${mins}`;
}

export function ThreadBubble({ message }: ThreadBubbleProps) {
  const isInbound = message.direction.includes("inbound");
  const arrow = isInbound ? "\u2190" : "\u2192";
  const bodyColor = isInbound ? colors.cyan : colors.orange;
  const statusColor = STATUS_COLORS[message.status] ?? colors.fgDark;
  const date = formatDate(message.dateCreated);

  return (
    <box
      style={{
        flexDirection: "column",
        alignItems: isInbound ? "flex-start" : "flex-end",
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <text fg={bodyColor}>
        {arrow} {message.body}
      </text>
      <box style={{ flexDirection: "row", gap: 1 }}>
        <text fg={colors.fgDark}>{date}</text>
        <text fg={statusColor}>{message.status}</text>
      </box>
    </box>
  );
}
