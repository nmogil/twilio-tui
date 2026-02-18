import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { CallRow } from "./call-row";
import { colors } from "../constants";
import type { TwilioCall } from "../types";

interface CallListProps {
  calls: TwilioCall[];
  loading: boolean;
  error: string | null;
  focused: boolean;
}

export function CallList({ calls, loading, error, focused }: CallListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      setSelectedIndex((i) => Math.min(i + 1, calls.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (loading && calls.length === 0) {
    return (
      <box
        title="Calls"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>Loading calls...</text>
      </box>
    );
  }

  if (error && calls.length === 0) {
    return (
      <box
        title="Calls"
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

  if (calls.length === 0) {
    return (
      <box
        title="Calls"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No calls found</text>
      </box>
    );
  }

  return (
    <box
      title="Calls"
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
        {calls.map((c, i) => (
          <CallRow key={c.sid} call={c} selected={i === selectedIndex} />
        ))}
      </scrollbox>
    </box>
  );
}
