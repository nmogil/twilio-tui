import { useKeyboard } from "@opentui/react";
import { ProfileRow } from "./profile-row";
import { colors } from "../constants";
import type { TwilioProfile } from "../types";

interface ProfileListProps {
  profiles: TwilioProfile[];
  loading: boolean;
  error: string | null;
  focused: boolean;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

export function ProfileList({
  profiles,
  loading,
  error,
  focused,
  selectedIndex,
  onSelectedIndexChange,
}: ProfileListProps) {
  useKeyboard((key) => {
    if (!focused) return;

    if (key.name === "j" || key.name === "down") {
      onSelectedIndexChange(Math.min(selectedIndex + 1, profiles.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (loading && profiles.length === 0) {
    return (
      <box
        title="Profiles"
        style={{
          border: true,
          borderColor,
          width: "45%",
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>Loading profiles...</text>
      </box>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <box
        title="Profiles"
        style={{
          border: true,
          borderColor,
          width: "45%",
          padding: 1,
        }}
      >
        <text fg={colors.red}>Error: {error}</text>
      </box>
    );
  }

  if (profiles.length === 0) {
    return (
      <box
        title="Profiles"
        style={{
          border: true,
          borderColor,
          width: "45%",
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No profiles found</text>
      </box>
    );
  }

  return (
    <box
      title="Profiles"
      style={{
        border: true,
        borderColor,
        width: "45%",
      }}
    >
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {profiles.map((profile, i) => (
          <ProfileRow key={profile.id} profile={profile} selected={i === selectedIndex} />
        ))}
      </scrollbox>
    </box>
  );
}
