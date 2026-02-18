import { useState, useRef, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { ThreadBubble } from "./thread-bubble";
import { colors } from "../constants";
import type { Conversation, TwilioPhoneNumber, FocusZone } from "../types";
import type { TextareaRenderable } from "@opentui/core";

interface ThreadViewProps {
  conversation: Conversation | null;
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  sending: boolean;
  sendError: string | null;
  onSend: (from: string, to: string, body: string) => void;
}

export function ThreadView({
  conversation,
  phoneNumbers,
  zone,
  sending,
  sendError,
  onSend,
}: ThreadViewProps) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const threadFocused = zone === "thread-view";
  const replyFocused = zone === "reply-textarea";
  const panelActive = threadFocused || replyFocused;
  const borderColor = panelActive ? colors.borderFocused : colors.border;

  const handleSend = useCallback(() => {
    if (sending || !conversation) return;
    const body = textareaRef.current?.plainText ?? "";
    if (!body.trim()) return;

    // Auto-detect from number: find outbound message's from, fallback to first phone number
    const outbound = conversation.messages.find((m) => !m.direction.includes("inbound"));
    const from = outbound?.from ?? phoneNumbers[0]?.phoneNumber ?? "";
    const to = conversation.contactNumber;

    onSend(from, to, body);
    textareaRef.current?.setText("");
  }, [sending, conversation, phoneNumbers, onSend]);

  useKeyboard((key) => {
    if (key.name === "return" && key.ctrl) {
      handleSend();
      return;
    }

    if (!threadFocused || !conversation) return;

    if (key.name === "j" || key.name === "down") {
      setScrollOffset((o) => Math.min(o + 1, conversation.messages.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      setScrollOffset((o) => Math.max(o - 1, 0));
    }
  });

  if (!conversation) {
    return (
      <box
        title="Thread"
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
        <text fg={colors.fgDark}>Select a conversation</text>
      </box>
    );
  }

  return (
    <box
      title={conversation.contactNumber}
      style={{
        border: true,
        borderColor,
        width: "55%",
        flexDirection: "column",
      }}
    >
      {/* Message thread */}
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {conversation.messages.map((msg) => (
          <ThreadBubble key={msg.sid} message={msg} />
        ))}
      </scrollbox>

      {/* Separator */}
      <text fg={colors.border}>{"\u2500".repeat(60)}</text>

      {/* Reply area */}
      <box
        style={{
          flexDirection: "column",
          padding: 1,
          height: 6,
        }}
      >
        <textarea
          ref={textareaRef}
          focused={replyFocused}
          placeholder="Type a reply..."
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
          focusedTextColor={colors.fg}
          style={{ flexGrow: 1 }}
        />
        <box style={{ flexDirection: "row", gap: 1 }}>
          {sending && <text fg={colors.yellow}>Sending...</text>}
          {sendError && <text fg={colors.red}>Error: {sendError}</text>}
          {!sending && !sendError && (
            <text fg={colors.fgDark}>Ctrl+Enter to send</text>
          )}
        </box>
      </box>
    </box>
  );
}
