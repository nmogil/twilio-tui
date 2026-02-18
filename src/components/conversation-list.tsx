import { useKeyboard } from "@opentui/react";
import { ConversationRow } from "./conversation-row";
import { colors } from "../constants";
import type { Conversation } from "../types";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  focused: boolean;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

export function ConversationList({
  conversations,
  loading,
  error,
  focused,
  selectedIndex,
  onSelectedIndexChange,
}: ConversationListProps) {
  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      onSelectedIndexChange(Math.min(selectedIndex + 1, conversations.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (loading && conversations.length === 0) {
    return (
      <box
        title="Conversations [n:new]"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>Loading messages...</text>
      </box>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <box
        title="Conversations [n:new]"
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

  if (conversations.length === 0) {
    return (
      <box
        title="Conversations [n:new]"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No conversations</text>
      </box>
    );
  }

  return (
    <box
      title="Conversations [n:new]"
      style={{
        border: true,
        borderColor,
        flexGrow: 1,
      }}
    >
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {conversations.map((conv, i) => (
          <ConversationRow
            key={conv.contactNumber}
            conversation={conv}
            selected={i === selectedIndex}
          />
        ))}
      </scrollbox>
    </box>
  );
}
