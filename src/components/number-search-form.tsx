import { colors } from "../constants";
import type { FocusZone } from "../types";

interface NumberSearchFormProps {
  countryCode: string;
  areaCode: string;
  contains: string;
  onCountryCodeChange: (v: string) => void;
  onAreaCodeChange: (v: string) => void;
  onContainsChange: (v: string) => void;
  zone: FocusZone;
  searching: boolean;
  searchError: string | null;
}

export function NumberSearchForm({
  countryCode,
  areaCode,
  contains,
  onCountryCodeChange,
  onAreaCodeChange,
  onContainsChange,
  zone,
  searching,
  searchError,
}: NumberSearchFormProps) {
  const countryFocused = zone === "search-country";
  const areaFocused = zone === "search-area-code";
  const containsFocused = zone === "search-contains";
  const formActive = countryFocused || areaFocused || containsFocused;
  const borderColor = formActive ? colors.borderFocused : colors.border;

  return (
    <box
      title="Search [s:manage]"
      style={{
        border: true,
        borderColor,
        flexDirection: "column",
        gap: 1,
        padding: 1,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Country:</text>
        <input
          value={countryCode}
          focused={countryFocused}
          onInput={onCountryCodeChange}
          placeholder="US"
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Area Code:</text>
        <input
          value={areaCode}
          focused={areaFocused}
          onInput={onAreaCodeChange}
          placeholder="415"
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Contains:</text>
        <input
          value={contains}
          focused={containsFocused}
          onInput={onContainsChange}
          placeholder="e.g. 555"
          backgroundColor={colors.bgDark}
          textColor={colors.fg}
          focusedBackgroundColor={colors.bgHighlight}
        />
      </box>

      <box style={{ flexDirection: "row", gap: 1 }}>
        {searching && <text fg={colors.yellow}>Searching...</text>}
        {searchError && <text fg={colors.red}>Error: {searchError}</text>}
        {!searching && !searchError && (
          <text fg={colors.fgDark}>Ctrl+Enter to search</text>
        )}
      </box>
    </box>
  );
}
