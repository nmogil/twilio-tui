import { useKeyboard } from "@opentui/react";
import { SearchResultRow } from "./search-result-row";
import { colors } from "../constants";
import type { AvailablePhoneNumber } from "../types";

interface SearchResultListProps {
  results: AvailablePhoneNumber[];
  searching: boolean;
  searchError: string | null;
  hasSearched: boolean;
  focused: boolean;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

export function SearchResultList({
  results,
  searching,
  searchError,
  hasSearched,
  focused,
  selectedIndex,
  onSelectedIndexChange,
}: SearchResultListProps) {
  useKeyboard((key) => {
    if (!focused) return;
    if (key.name === "j" || key.name === "down") {
      onSelectedIndexChange(Math.min(selectedIndex + 1, results.length - 1));
    } else if (key.name === "k" || key.name === "up") {
      onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
    }
  });

  const borderColor = focused ? colors.borderFocused : colors.border;

  if (searching) {
    return (
      <box
        title="Results"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.yellow}>Searching...</text>
      </box>
    );
  }

  if (searchError) {
    return (
      <box
        title="Results"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.red}>Error: {searchError}</text>
      </box>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <box
        title="Results"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>No numbers found</text>
      </box>
    );
  }

  if (!hasSearched) {
    return (
      <box
        title="Results"
        style={{
          border: true,
          borderColor,
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={colors.fgDark}>Search for available numbers above</text>
      </box>
    );
  }

  return (
    <box
      title={`Results (${results.length} found)`}
      style={{
        border: true,
        borderColor,
        flexGrow: 1,
      }}
    >
      <scrollbox style={{ flexGrow: 1 }} scrollY={true}>
        {results.map((n, i) => (
          <SearchResultRow
            key={n.phoneNumber}
            number={n}
            selected={i === selectedIndex}
          />
        ))}
      </scrollbox>
    </box>
  );
}
