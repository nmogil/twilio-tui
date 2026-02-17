import { colors } from "../constants";
import type { TabId } from "../types";

interface PlaceholderTabProps {
  tabId: TabId;
}

const TAB_LABELS: Record<TabId, string> = {
  messages: "Messages",
  calls: "Calls",
  numbers: "Numbers",
  logs: "Logs",
};

export function PlaceholderTab({ tabId }: PlaceholderTabProps) {
  return (
    <box
      style={{
        flexGrow: 1,
        border: true,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <text fg={colors.fgDark}>
        {TAB_LABELS[tabId]} — Coming soon
      </text>
    </box>
  );
}
