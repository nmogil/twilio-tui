import { colors } from "../constants";
import type { AvailablePhoneNumber } from "../types";

interface SearchResultRowProps {
  number: AvailablePhoneNumber;
  selected: boolean;
}

export function SearchResultRow({ number, selected }: SearchResultRowProps) {
  const bgColor = selected ? colors.bgHighlight : undefined;
  const caps = number.capabilities;
  const location = [number.locality, number.region].filter(Boolean).join(", ");

  return (
    <box style={{ flexDirection: "row", gap: 1, backgroundColor: bgColor }}>
      <text fg={colors.blue}>{number.phoneNumber.padEnd(15)}</text>
      <text fg={colors.fg}>{location.padEnd(25)}</text>
      <text fg={caps.voice ? colors.green : colors.fgDark}>{caps.voice ? "V" : "\u00B7"}</text>
      <text fg={caps.SMS ? colors.green : colors.fgDark}>{caps.SMS ? "S" : "\u00B7"}</text>
      <text fg={caps.MMS ? colors.green : colors.fgDark}>{caps.MMS ? "M" : "\u00B7"}</text>
    </box>
  );
}
