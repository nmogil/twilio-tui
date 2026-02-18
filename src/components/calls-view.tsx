import { CallList } from "./call-list";
import { DialerPanel } from "./dialer-panel";
import type { TwilioCall, TwilioPhoneNumber, FocusZone } from "../types";

interface CallsViewProps {
  calls: TwilioCall[];
  callsLoading: boolean;
  callsError: string | null;
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  calling: boolean;
  callError: string | null;
  onCall: (from: string, to: string, url: string) => void;
}

export function CallsView({
  calls,
  callsLoading,
  callsError,
  phoneNumbers,
  zone,
  calling,
  callError,
  onCall,
}: CallsViewProps) {
  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <CallList
        calls={calls}
        loading={callsLoading}
        error={callsError}
        focused={zone === "call-list"}
      />
      <DialerPanel
        phoneNumbers={phoneNumbers}
        zone={zone}
        calling={calling}
        callError={callError}
        onCall={onCall}
      />
    </box>
  );
}
