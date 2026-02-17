import { useState, useCallback } from "react";
import { useKeyboard } from "@opentui/react";
import { FOCUS_ORDER } from "../constants";
import type { FocusZone } from "../types";

export function useFocus() {
  const [zone, setZone] = useState<FocusZone>("tabs");

  const focusZone = useCallback((z: FocusZone) => setZone(z), []);

  useKeyboard((key) => {
    if (key.name === "escape") {
      setZone("tabs");
      return;
    }

    if (key.name !== "tab") return;

    setZone((current) => {
      const idx = FOCUS_ORDER.indexOf(current);
      if (key.shift) {
        return FOCUS_ORDER[(idx - 1 + FOCUS_ORDER.length) % FOCUS_ORDER.length];
      }
      return FOCUS_ORDER[(idx + 1) % FOCUS_ORDER.length];
    });
  });

  return { zone, focusZone };
}
