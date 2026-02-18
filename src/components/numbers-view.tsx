import { useState } from "react";
import { NumberList } from "./number-list";
import { NumberDetailPanel } from "./number-detail-panel";
import type { TwilioPhoneNumber, FocusZone } from "../types";

interface NumbersViewProps {
  numbers: TwilioPhoneNumber[];
  numbersLoading: boolean;
  numbersError: string | null;
  zone: FocusZone;
  updating: boolean;
  updateError: string | null;
  onUpdate: (
    sid: string,
    updates: { friendlyName?: string; voiceUrl?: string; smsUrl?: string }
  ) => void;
}

export function NumbersView({
  numbers,
  numbersLoading,
  numbersError,
  zone,
  updating,
  updateError,
  onUpdate,
}: NumbersViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedNumber = numbers[selectedIndex] ?? null;

  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <NumberList
        numbers={numbers}
        loading={numbersLoading}
        error={numbersError}
        focused={zone === "number-list"}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
      />
      <NumberDetailPanel
        number={selectedNumber}
        zone={zone}
        updating={updating}
        updateError={updateError}
        onUpdate={onUpdate}
      />
    </box>
  );
}
