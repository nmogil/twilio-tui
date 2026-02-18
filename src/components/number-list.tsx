import { useKeyboard } from "@opentui/react";
import { NumberRow } from "./number-row";
import { colors } from "../constants";
import type { TwilioPhoneNumber } from "../types";

interface NumberListProps {
  numbers: TwilioPhoneNumber[];
  loading: boolean;
  error: string | null;
  focused: boolean;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

export function NumberList({
  numbers,
  loading,
  error,
  focused,
  selectedIndex,
  onSelectedIndexChange,
}: NumberListProps) {
  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      onSelectedIndexChange(Math.min(selectedIndex + 1, numbers.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (loading && numbers.length === 0) {
    return (
      <box
        title="Numbers"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>Loading numbers...</text>
      </box>
    );
  }

  if (error && numbers.length === 0) {
    return (
      <box
        title="Numbers"
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

  if (numbers.length === 0) {
    return (
      <box
        title="Numbers"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No phone numbers found</text>
      </box>
    );
  }

  return (
    <box
      title="Numbers"
      style={{
        border: true,
        borderColor,
        flexGrow: 1,
      }}
    >
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {numbers.map((n, i) => (
          <NumberRow key={n.sid} number={n} selected={i === selectedIndex} />
        ))}
      </scrollbox>
    </box>
  );
}
