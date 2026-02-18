import { colors } from "../constants";
import type { TwilioProfile } from "../types";

interface ProfileRowProps {
  profile: TwilioProfile;
  selected: boolean;
}

function padEnd(str: string, len: number): string {
  if (str.length >= len) return str.slice(0, len);
  return str + " ".repeat(len - str.length);
}

export function ProfileRow({ profile, selected }: ProfileRowProps) {
  const indicator = profile.active ? "\u25cf" : "\u25cb";
  const indicatorColor = profile.active ? colors.green : colors.fgDark;
  const name = padEnd(profile.id, 20);

  return (
    <box
      style={{
        flexDirection: "row",
        gap: 1,
        backgroundColor: selected ? colors.bgHighlight : undefined,
        padding: 0,
      }}
    >
      <text fg={indicatorColor}>{indicator}</text>
      <text fg={colors.fg}>{name}</text>
      <text fg={colors.fgDark}>{profile.accountSid}</text>
    </box>
  );
}
