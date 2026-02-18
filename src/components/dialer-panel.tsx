import { useState, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { colors } from "../constants";
import type { TwilioPhoneNumber, FocusZone } from "../types";

interface DialerPanelProps {
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  calling: boolean;
  callError: string | null;
  onCall: (from: string, to: string, url: string) => void;
}

export function DialerPanel({
  phoneNumbers,
  zone,
  calling,
  callError,
  onCall,
}: DialerPanelProps) {
  const [fromIndex, setFromIndex] = useState(0);
  const [toValue, setToValue] = useState("");
  const [urlValue, setUrlValue] = useState("");

  const fromFocused = zone === "dialer-from";
  const toFocused = zone === "dialer-to";
  const urlFocused = zone === "dialer-url";
  const panelActive = fromFocused || toFocused || urlFocused;

  const handleCall = useCallback(() => {
    if (calling) return;
    const from = phoneNumbers[fromIndex]?.phoneNumber ?? "";
    onCall(from, toValue, urlValue);
  }, [calling, phoneNumbers, fromIndex, toValue, urlValue, onCall]);

  useKeyboard((key) => {
    if (key.name === "return" && key.ctrl) {
      handleCall();
    }
  });

  const borderColor = panelActive ? colors.borderFocused : colors.border;

  const selectOptions = phoneNumbers.map((n) => ({
    name: n.phoneNumber,
    description: n.friendlyName,
  }));

  return (
    <box
      title="Dialer"
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

      {/* TwiML URL */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>TwiML URL:</text>
        <input
          placeholder="https://example.com/twiml"
          value={urlValue}
          focused={urlFocused}
          onInput={setUrlValue}
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      {/* Status line */}
      <box style={{ flexDirection: "row", gap: 1 }}>
        {calling && <text fg={colors.yellow}>Calling...</text>}
        {callError && <text fg={colors.red}>Error: {callError}</text>}
        {!calling && !callError && (
          <text fg={colors.fgDark}>Ctrl+Enter to call</text>
        )}
      </box>
    </box>
  );
}
