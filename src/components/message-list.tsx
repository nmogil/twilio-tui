import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { MessageRow } from "./message-row";
import { colors } from "../constants";
import type { TwilioMessage } from "../types";

interface MessageListProps {
  messages: TwilioMessage[];
  loading: boolean;
  error: string | null;
  focused: boolean;
}

export function MessageList({ messages, loading, error, focused }: MessageListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      setSelectedIndex((i) => Math.min(i + 1, messages.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (loading && messages.length === 0) {
    return (
      <box
        title="Messages"
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

  if (error && messages.length === 0) {
    return (
      <box
        title="Messages"
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

  if (messages.length === 0) {
    return (
      <box
        title="Messages"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No messages found</text>
      </box>
    );
  }

  return (
    <box
      title="Messages"
      style={{
        border: true,
        borderColor,
        flexGrow: 1,
      }}
    >
      <scrollbox
        style={{ flexGrow: 1 }}
        scrollY={true}
      >
        {messages.map((msg, i) => (
          <MessageRow key={msg.sid} message={msg} selected={i === selectedIndex} />
        ))}
      </scrollbox>
    </box>
  );
}
