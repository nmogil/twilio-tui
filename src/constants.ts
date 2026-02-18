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
  { id: "account", label: "Account" },
];

export const FOCUS_ORDERS: Record<string, FocusZone[]> = {
  messages: ["tabs", "message-list", "from-select", "to-input", "body-textarea"],
  calls: ["tabs", "call-list", "dialer-from", "dialer-to", "dialer-url"],
  numbers: ["tabs", "number-list", "number-friendly-name", "number-voice-url", "number-sms-url"],
  logs: ["tabs", "log-list", "log-detail"],
  account: ["tabs", "profile-list", "account-detail"],
  "numbers-search": [
    "tabs",
    "search-country",
    "search-area-code",
    "search-contains",
    "search-results",
    "purchase-panel",
  ],
};

export const POLL_INTERVAL_MS = 15_000;
export const ACCOUNT_POLL_INTERVAL_MS = 60_000;
export const MAX_MESSAGES = 50;
export const MAX_CALLS = 50;
export const MAX_NUMBERS = 50;
export const MAX_LOGS = 50;
export const MAX_SEARCH_RESULTS = 20;
