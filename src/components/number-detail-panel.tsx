import { useState, useEffect, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { colors } from "../constants";
import type { TwilioPhoneNumber, FocusZone } from "../types";

interface NumberDetailPanelProps {
  number: TwilioPhoneNumber | null;
  zone: FocusZone;
  updating: boolean;
  updateError: string | null;
  onUpdate: (
    sid: string,
    updates: { friendlyName?: string; voiceUrl?: string; smsUrl?: string }
  ) => void;
}

export function NumberDetailPanel({
  number,
  zone,
  updating,
  updateError,
  onUpdate,
}: NumberDetailPanelProps) {
  const [friendlyName, setFriendlyName] = useState("");
  const [voiceUrl, setVoiceUrl] = useState("");
  const [smsUrl, setSmsUrl] = useState("");

  useEffect(() => {
    if (number) {
      setFriendlyName(number.friendlyName ?? "");
      setVoiceUrl(number.voiceUrl ?? "");
      setSmsUrl(number.smsUrl ?? "");
    }
  }, [number?.sid]);

  const nameFocused = zone === "number-friendly-name";
  const voiceFocused = zone === "number-voice-url";
  const smsFocused = zone === "number-sms-url";
  const panelActive = nameFocused || voiceFocused || smsFocused;

  const handleUpdate = useCallback(() => {
    if (updating || !number) return;
    onUpdate(number.sid, { friendlyName, voiceUrl, smsUrl });
  }, [updating, number, friendlyName, voiceUrl, smsUrl, onUpdate]);

  useKeyboard((key) => {
    if (key.name === "return" && key.ctrl) {
      handleUpdate();
    }
  });

  const borderColor = panelActive ? colors.borderFocused : colors.border;

  if (!number) {
    return (
      <box
        title="Details"
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
        <text fg={colors.fgDark}>No number selected</text>
      </box>
    );
  }

  return (
    <box
      title="Details"
      style={{
        border: true,
        borderColor,
        width: "55%",
        flexDirection: "column",
        gap: 1,
        padding: 1,
      }}
    >
      {/* Read-only info */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Phone Number:</text>
        <text fg={colors.blue}>{number.phoneNumber}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>SID:</text>
        <text fg={colors.fgDark}>{number.sid}</text>
      </box>

      {/* Editable: Friendly Name */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Friendly Name:</text>
        <input
          value={friendlyName}
          focused={nameFocused}
          onInput={setFriendlyName}
          placeholder="My Number"
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      {/* Editable: Voice URL */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Voice URL:</text>
        <input
          value={voiceUrl}
          focused={voiceFocused}
          onInput={setVoiceUrl}
          placeholder="https://example.com/voice"
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      {/* Editable: SMS URL */}
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>SMS URL:</text>
        <input
          value={smsUrl}
          focused={smsFocused}
          onInput={setSmsUrl}
          placeholder="https://example.com/sms"
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      {/* Spacer */}
      <box style={{ flexGrow: 1 }} />

      {/* Status line */}
      <box style={{ flexDirection: "row", gap: 1 }}>
        {updating && <text fg={colors.yellow}>Updating...</text>}
        {updateError && <text fg={colors.red}>Error: {updateError}</text>}
        {!updating && !updateError && (
          <text fg={colors.fgDark}>Ctrl+Enter to save</text>
        )}
      </box>
    </box>
  );
}
