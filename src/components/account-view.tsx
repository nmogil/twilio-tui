import { useState } from "react";
import { ProfileList } from "./profile-list";
import { AccountDetailPanel } from "./account-detail-panel";
import type { TwilioProfile, TwilioBalance, TwilioUsageRecord, FocusZone } from "../types";

interface AccountViewProps {
  profiles: TwilioProfile[];
  balance: TwilioBalance | null;
  usage: TwilioUsageRecord[];
  profilesLoading: boolean;
  profilesError: string | null;
  phoneNumberCount: number;
  zone: FocusZone;
  switching: boolean;
  switchError: string | null;
  onSwitch: (profileId: string) => void;
}

export function AccountView({
  profiles,
  balance,
  usage,
  profilesLoading,
  profilesError,
  phoneNumberCount,
  zone,
  switching,
  switchError,
  onSwitch,
}: AccountViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedProfile = profiles[selectedIndex] ?? null;

  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <ProfileList
        profiles={profiles}
        loading={profilesLoading}
        error={profilesError}
        focused={zone === "profile-list"}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
      />
      <AccountDetailPanel
        profile={selectedProfile}
        balance={balance}
        usage={usage}
        phoneNumberCount={phoneNumberCount}
        zone={zone}
        switching={switching}
        switchError={switchError}
        onSwitch={onSwitch}
      />
    </box>
  );
}
