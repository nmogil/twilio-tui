import { colors } from "../constants";
import type { Conversation } from "../types";

interface ConversationRowProps {
  conversation: Conversation;
  selected: boolean;
}

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

export function ConversationRow({ conversation, selected }: ConversationRowProps) {
  const { lastMessage, contactNumber, messageCount } = conversation;
  const isInbound = lastMessage.direction.includes("inbound");
  const arrow = isInbound ? "\u2190" : "\u2192";
  const arrowColor = isInbound ? colors.cyan : colors.orange;
  const date = formatDate(lastMessage.dateCreated);
  const body = truncate(lastMessage.body.replace(/\n/g, " "), 30);

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
      <text fg={colors.fg}>{contactNumber.padEnd(15)}</text>
      <text fg={colors.fgDark}>({messageCount})</text>
      <text fg={colors.fgDark}>{date}</text>
      <text fg={colors.fg}>{body}</text>
    </box>
  );
}
