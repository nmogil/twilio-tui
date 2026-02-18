import { useState, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { colors } from "../constants";
import type { AvailablePhoneNumber, FocusZone } from "../types";

interface PurchasePanelProps {
  number: AvailablePhoneNumber | null;
  zone: FocusZone;
  purchasing: boolean;
  purchaseError: string | null;
  onPurchase: (phoneNumber: string) => void;
}

export function PurchasePanel({
  number,
  zone,
  purchasing,
  purchaseError,
  onPurchase,
}: PurchasePanelProps) {
  const [confirmPending, setConfirmPending] = useState(false);
  const panelFocused = zone === "purchase-panel";

  // Reset confirmation when focus leaves or number changes
  useEffect(() => {
    if (!panelFocused) setConfirmPending(false);
  }, [panelFocused]);

  useEffect(() => {
    setConfirmPending(false);
  }, [number?.phoneNumber]);

  useKeyboard((key) => {
    if (!panelFocused || !number || purchasing) return;

    if (key.name === "return" && key.ctrl && !confirmPending) {
      setConfirmPending(true);
      return;
    }

    if (confirmPending) {
      if (key.name === "y") {
        setConfirmPending(false);
        onPurchase(number.phoneNumber);
      } else if (key.name === "n") {
        setConfirmPending(false);
      }
    }
  });

  const borderColor = panelFocused ? colors.borderFocused : colors.border;

  if (!number) {
    return (
      <box
        title="Purchase"
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

  const caps = number.capabilities;
  const capStr = [
    caps.voice ? "Voice" : null,
    caps.SMS ? "SMS" : null,
    caps.MMS ? "MMS" : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <box
      title="Purchase"
      style={{
        border: true,
        borderColor,
        width: "55%",
        flexDirection: "column",
        gap: 1,
        padding: 1,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Phone Number:</text>
        <text fg={colors.blue}>{number.phoneNumber}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Locality:</text>
        <text fg={colors.fg}>{number.locality || "N/A"}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Region:</text>
        <text fg={colors.fg}>{number.region || "N/A"}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Country:</text>
        <text fg={colors.fg}>{number.isoCountry || "N/A"}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Postal Code:</text>
        <text fg={colors.fg}>{number.postalCode || "N/A"}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Capabilities:</text>
        <text fg={colors.green}>{capStr || "None"}</text>
      </box>

      {/* Spacer */}
      <box style={{ flexGrow: 1 }} />

      {/* Status line */}
      <box style={{ flexDirection: "row", gap: 1 }}>
        {purchasing && <text fg={colors.yellow}>Purchasing...</text>}
        {purchaseError && <text fg={colors.red}>Error: {purchaseError}</text>}
        {confirmPending && (
          <text fg={colors.yellow}>Press y to confirm, n to cancel</text>
        )}
        {!purchasing && !purchaseError && !confirmPending && (
          <text fg={colors.fgDark}>Ctrl+Enter to purchase</text>
        )}
      </box>
    </box>
  );
}
