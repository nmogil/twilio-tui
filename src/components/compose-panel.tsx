import { useState, useRef, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { colors } from "../constants";
import type { TwilioPhoneNumber, FocusZone } from "../types";
import type { TextareaRenderable } from "@opentui/core";

interface ComposePanelProps {
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  sending: boolean;
  sendError: string | null;
  onSend: (from: string, to: string, body: string) => void;
}

export function ComposePanel({
  phoneNumbers,
  zone,
  sending,
  sendError,
  onSend,
}: ComposePanelProps) {
  const [fromIndex, setFromIndex] = useState(0);
  const [toValue, setToValue] = useState("");
  const textareaRef = useRef<TextareaRenderable>(null);

  const fromFocused = zone === "from-select";
  const toFocused = zone === "to-input";
  const bodyFocused = zone === "body-textarea";
  const panelActive = fromFocused || toFocused || bodyFocused;

  const handleSend = useCallback(() => {
    if (sending) return;
    const from = phoneNumbers[fromIndex]?.phoneNumber ?? "";
    const body = textareaRef.current?.plainText ?? "";
    onSend(from, toValue, body);
  }, [sending, phoneNumbers, fromIndex, toValue, onSend]);

  useKeyboard((key) => {
    if (key.name === "return" && key.ctrl) {
      handleSend();
    }
  });

  const borderColor = panelActive ? colors.borderFocused : colors.border;

  const selectOptions = phoneNumbers.map((n) => ({
    name: n.phoneNumber,
    description: n.friendlyName,
  }));

  return (
    <box
      title="Compose"
      style={{
        border: true,
        borderColor,
        width: "55%",
        flexDirection: "column",
        gap: 1,
        padding: 1,
      }}
    >
      {/* From number */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>From:</text>
        {selectOptions.length > 0 ? (
          <select
            options={selectOptions}
            focused={fromFocused}
            height={3}
            backgroundColor={colors.bgDark}
            textColor={colors.fg}
            selectedBackgroundColor={colors.bgHighlight}
            selectedTextColor={colors.blue}
            showDescription={false}
            onChange={(index) => setFromIndex(index)}
          />
        ) : (
          <text fg={colors.fgDark}>No phone numbers available</text>
        )}
      </box>

      {/* To number */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>To:</text>
        <input
          placeholder="+1234567890"
          value={toValue}
          focused={toFocused}
          onInput={setToValue}
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      {/* Message body */}
      <box style={{ flexDirection: "column", flexGrow: 1 }}>
        <text fg={colors.fgDark}>Body:</text>
        <textarea
          ref={textareaRef}
          focused={bodyFocused}
          placeholder="Type your message..."
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
          focusedTextColor={colors.fg}
          style={{ flexGrow: 1 }}
        />
      </box>

      {/* Status line */}
      <box style={{ flexDirection: "row", gap: 1 }}>
        {sending && <text fg={colors.yellow}>Sending...</text>}
        {sendError && <text fg={colors.red}>Error: {sendError}</text>}
        {!sending && !sendError && (
          <text fg={colors.fgDark}>Ctrl+Enter to send</text>
        )}
      </box>
    </box>
  );
}
