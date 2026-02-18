import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { NumberList } from "./number-list";
import { NumberDetailPanel } from "./number-detail-panel";
import { NumberSearchView } from "./number-search-view";
import type { TwilioPhoneNumber, FocusZone, NumbersMode } from "../types";

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
  purchasing: boolean;
  purchaseError: string | null;
  onPurchase: (phoneNumber: string) => void;
  numbersMode: NumbersMode;
  onModeChange: (mode: NumbersMode) => void;
}

export function NumbersView({
  numbers,
  numbersLoading,
  numbersError,
  zone,
  updating,
  updateError,
  onUpdate,
  purchasing,
  purchaseError,
  onPurchase,
  numbersMode,
  onModeChange,
}: NumbersViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedNumber = numbers[selectedIndex] ?? null;

  useKeyboard((key) => {
    if (numbersMode === "manage" && zone === "number-list" && key.name === "s") {
      onModeChange("search");
    }
    if (
      numbersMode === "search" &&
      (zone === "search-results" || zone === "purchase-panel") &&
      key.name === "m"
    ) {
      onModeChange("manage");
    }
  });

  if (numbersMode === "search") {
    return (
      <NumberSearchView
        zone={zone}
        purchasing={purchasing}
        purchaseError={purchaseError}
        onPurchase={onPurchase}
      />
    );
  }

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
