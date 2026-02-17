import type { FocusZone, TabId } from "./types";

// Tokyo Night color palette
export const colors = {
  bg: "#1a1b26",
  bgDark: "#16161e",
  bgHighlight: "#292e42",
  fg: "#c0caf5",
  fgDark: "#565f89",
  blue: "#7aa2f7",
  cyan: "#7dcfff",
  green: "#9ece6a",
  magenta: "#bb9af7",
  red: "#f7768e",
  orange: "#ff9e64",
  yellow: "#e0af68",
  border: "#3b4261",
  borderFocused: "#7aa2f7",
} as const;

export const TABS: { id: TabId; label: string }[] = [
  { id: "messages", label: "Messages" },
  { id: "calls", label: "Calls" },
  { id: "numbers", label: "Numbers" },
  { id: "logs", label: "Logs" },
];

export const FOCUS_ORDER: FocusZone[] = [
  "tabs",
  "message-list",
  "from-select",
  "to-input",
  "body-textarea",
];

export const POLL_INTERVAL_MS = 15_000;
export const MAX_MESSAGES = 50;
