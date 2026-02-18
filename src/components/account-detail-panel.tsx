import { useKeyboard } from "@opentui/react";
import { colors } from "../constants";
import type { TwilioProfile, TwilioBalance, TwilioUsageRecord, FocusZone } from "../types";

interface AccountDetailPanelProps {
  profile: TwilioProfile | null;
  balance: TwilioBalance | null;
  usage: TwilioUsageRecord[];
  phoneNumberCount: number;
  zone: FocusZone;
  switching: boolean;
  switchError: string | null;
  onSwitch: (profileId: string) => void;
}

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `${amount} ${currency}`;
  return `${currency} ${num.toFixed(2)}`;
}

function getTopUsageItems(records: TwilioUsageRecord[]): TwilioUsageRecord[] {
  return records
    .filter((r) => parseFloat(r.price) !== 0)
    .sort((a, b) => Math.abs(parseFloat(b.price)) - Math.abs(parseFloat(a.price)))
    .slice(0, 5);
}

export function AccountDetailPanel({
  profile,
  balance,
  usage,
  phoneNumberCount,
  zone,
  switching,
  switchError,
  onSwitch,
}: AccountDetailPanelProps) {
  const panelFocused = zone === "account-detail";
  const borderColor = panelFocused ? colors.borderFocused : colors.border;

  useKeyboard((key) => {
    if (!panelFocused || !profile || profile.active || switching) return;

    if (key.name === "return" && key.ctrl) {
      onSwitch(profile.id);
    }
  });

  if (!profile) {
    return (
      <box
        title="Account Details"
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
        <text fg={colors.fgDark}>No profile selected</text>
      </box>
    );
  }

  const topUsage = getTopUsageItems(usage);

  return (
    <box
      title="Account Details"
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
        <text fg={colors.fgDark}>Profile:</text>
        <text fg={colors.blue}>{profile.id}</text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Account SID:</text>
        <text fg={colors.fgDark}>{profile.accountSid}</text>
      </box>

      <box style={{ flexDirection: "row", gap: 1 }}>
        <text fg={colors.fgDark}>Status:</text>
        <text fg={profile.active ? colors.green : colors.fgDark}>
          {profile.active ? "\u25cf Active" : "\u25cb Inactive"}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Balance:</text>
        {profile.active && balance ? (
          <text fg={colors.green}>{formatCurrency(balance.balance, balance.currency)}</text>
        ) : (
          <text fg={colors.fgDark}>
            {profile.active ? "Loading..." : "Switch to view balance"}
          </text>
        )}
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={colors.fgDark}>Phone Numbers:</text>
        <text fg={colors.fg}>{phoneNumberCount}</text>
      </box>

      {profile.active && topUsage.length > 0 && (
        <box style={{ flexDirection: "column" }}>
          <text fg={colors.fgDark}>Top Usage This Period:</text>
          {topUsage.map((record) => (
            <box key={record.category} style={{ flexDirection: "row", gap: 1 }}>
              <text fg={colors.fg}>  {record.description}</text>
              <text fg={colors.yellow}>{formatCurrency(record.price, record.priceUnit)}</text>
            </box>
          ))}
        </box>
      )}

      <box style={{ flexGrow: 1 }} />

      <box style={{ flexDirection: "row", gap: 1 }}>
        {switching && <text fg={colors.yellow}>Switching profile...</text>}
        {switchError && <text fg={colors.red}>Error: {switchError}</text>}
        {!switching && !switchError && !profile.active && (
          <text fg={colors.fgDark}>Ctrl+Enter to switch profile</text>
        )}
        {!switching && !switchError && profile.active && (
          <text fg={colors.fgDark}>Tab to switch panes | Esc to tabs</text>
        )}
      </box>
    </box>
  );
}
