import { useEffect, useRef } from "react";
import { TABS, colors } from "../constants";
import type { TabId } from "../types";
import type { TabSelectRenderable } from "@opentui/core";

interface TopBarProps {
  activeTab: TabId;
  focused: boolean;
  onTabChange: (tab: TabId) => void;
}

const tabOptions = TABS.map((t) => ({
  name: t.label,
  description: "",
  value: t.id,
}));

export function TopBar({ activeTab, focused, onTabChange }: TopBarProps) {
  const ref = useRef<TabSelectRenderable>(null);

  useEffect(() => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (ref.current && ref.current.getSelectedIndex() !== idx) {
      ref.current.setSelectedIndex(idx);
    }
  }, [activeTab]);

  return (
    <tab-select
      ref={ref}
      options={tabOptions}
      focused={focused}
      tabWidth={16}
      backgroundColor={colors.bgDark}
      textColor={colors.fgDark}
      selectedBackgroundColor={colors.bgHighlight}
      selectedTextColor={colors.blue}
      focusedBackgroundColor={colors.bgDark}
      focusedTextColor={colors.fg}
      showDescription={false}
      showUnderline={true}
      wrapSelection={true}
      onSelect={(index) => {
        const tab = TABS[index];
        if (tab) onTabChange(tab.id);
      }}
    />
  );
}
