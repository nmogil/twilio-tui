import { useState, useCallback, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { FOCUS_ORDERS } from "../constants";
import type { FocusZone, TabId } from "../types";

export function useFocus(activeTab: TabId) {
  const [zone, setZone] = useState<FocusZone>("tabs");

  const focusZone = useCallback((z: FocusZone) => setZone(z), []);

  // Reset to "tabs" when switching to a tab that doesn't include the current zone
  useEffect(() => {
    setZone((current) => {
      const order = FOCUS_ORDERS[activeTab];
      if (!order.includes(current)) return "tabs";
      return current;
    });
  }, [activeTab]);

  useKeyboard((key) => {
    if (key.name === "escape") {
      setZone("tabs");
      return;
    }

    if (key.name !== "tab") return;

    const order = FOCUS_ORDERS[activeTab];

    setZone((current) => {
      const idx = order.indexOf(current);
      if (key.shift) {
        return order[(idx - 1 + order.length) % order.length];
      }
      return order[(idx + 1) % order.length];
    });
  });

  return { zone, focusZone };
}
