import { colors } from "../constants";
import type { FocusZone } from "../types";

const LEVEL_COLORS: Record<string, string> = {
  all: colors.fg,
  error: colors.red,
  warning: colors.orange,
  notice: colors.yellow,
  debug: colors.fgDark,
};

interface LogToolbarProps {
  levelFilter: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  autoScroll: boolean;
  fastRefresh: boolean;
  filteredCount: number;
  totalCount: number;
  zone: FocusZone;
}

export function LogToolbar({
  levelFilter,
  searchQuery,
  onSearchQueryChange,
  autoScroll,
  fastRefresh,
  filteredCount,
  totalCount,
  zone,
}: LogToolbarProps) {
  const searchFocused = zone === "log-search";
  const levelColor = LEVEL_COLORS[levelFilter] ?? colors.fg;

  return (
    <box
      style={{
        flexDirection: "row",
        gap: 1,
        padding: 0,
        paddingLeft: 1,
        paddingRight: 1,
        backgroundColor: colors.bgDark,
      }}
    >
      <text fg={colors.fgDark}>[f]</text>
      <text fg={levelColor}>{levelFilter.toUpperCase().padEnd(7)}</text>
      <text fg={colors.fgDark}>/</text>
      <input
        placeholder="search..."
        value={searchQuery}
        focused={searchFocused}
        onInput={onSearchQueryChange}
        backgroundColor={colors.bgDark}
        textColor={colors.fg}
        focusedBackgroundColor={colors.bgHighlight}
      />
      <text fg={colors.fgDark}>[a]</text>
      <text fg={autoScroll ? colors.green : colors.fgDark}>
        {`auto-scroll:${autoScroll ? "on" : "off"}`}
      </text>
      <text fg={colors.fgDark}>[r]</text>
      <text fg={fastRefresh ? colors.green : colors.fgDark}>
        {`refresh:${fastRefresh ? "5s" : "15s"}`}
      </text>
      <text fg={colors.fgDark}>
        {`${filteredCount}/${totalCount} logs`}
      </text>
    </box>
  );
}
