import { useKeyboard } from "@opentui/react";
import { CallRow } from "./call-row";
import { colors } from "../constants";
import type { TwilioCall } from "../types";

const ACTIVE_STATUSES = new Set(["ringing", "in-progress", "queued"]);

interface CallListProps {
  calls: TwilioCall[];
  loading: boolean;
  error: string | null;
  focused: boolean;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
  heldCallSids: Set<string>;
  onEndCall?: (sid: string) => void;
  onHoldCall?: (sid: string) => void;
  onResumeCall?: (sid: string) => void;
}

export function CallList({
  calls,
  loading,
  error,
  focused,
  selectedIndex,
  onSelectedIndexChange,
  heldCallSids,
  onEndCall,
  onHoldCall,
  onResumeCall,
}: CallListProps) {
  const selectedCall = calls[selectedIndex] ?? null;
  const selectedIsActive = selectedCall
    ? ACTIVE_STATUSES.has(selectedCall.status)
    : false;

  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      onSelectedIndexChange(Math.min(selectedIndex + 1, calls.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
    } else if (key.name === "e" && selectedCall && selectedIsActive) {
      onEndCall?.(selectedCall.sid);
    } else if (key.name === "h" && selectedCall && selectedIsActive) {
      if (heldCallSids.has(selectedCall.sid)) {
        onResumeCall?.(selectedCall.sid);
      } else {
        onHoldCall?.(selectedCall.sid);
      }
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  // Find the boundary between active and history calls
  const firstHistoryIndex = calls.findIndex(
    (c) => !ACTIVE_STATUSES.has(c.status)
  );
  const hasActive = firstHistoryIndex !== 0;
  const hasHistory = firstHistoryIndex >= 0;

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
        flexDirection: "column",
      }}
    >
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {hasActive && (
          <text fg={colors.fgDark}>{`-- Active Calls --`}</text>
        )}
        {calls.map((c, i) => (
          <box key={c.sid} style={{ flexDirection: "column" }}>
            {hasActive && hasHistory && i === firstHistoryIndex && (
              <text fg={colors.fgDark}>{`-- History --`}</text>
            )}
            <CallRow
              call={c}
              selected={i === selectedIndex}
              held={heldCallSids.has(c.sid)}
            />
          </box>
        ))}
      </scrollbox>
      {focused && selectedIsActive && (
        <text fg={colors.fgDark}>
          {"e:end | h:hold/resume"}
        </text>
      )}
    </box>
  );
}
