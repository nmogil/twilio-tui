import { colors } from "../constants";
import type { TwilioPhoneNumber } from "../types";

interface NumberRowProps {
  number: TwilioPhoneNumber;
  selected: boolean;
}

export function NumberRow({ number, selected }: NumberRowProps) {
  const bgColor = selected ? colors.bgHighlight : undefined;

  const hasVoice = number.voiceUrl ? "V" : "\u00B7";
  const hasSms = number.smsUrl ? "S" : "\u00B7";

  return (
    <box style={{ flexDirection: "row", gap: 1, backgroundColor: bgColor }}>
      <text fg={colors.blue}>{number.phoneNumber.padEnd(15)}</text>
      <text fg={colors.fg}>{number.friendlyName.padEnd(20)}</text>
      <text fg={number.voiceUrl ? colors.green : colors.fgDark}>{hasVoice}</text>
      <text fg={number.smsUrl ? colors.green : colors.fgDark}>{hasSms}</text>
    </box>
  );
}
