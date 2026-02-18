import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { CallList } from "./call-list";
import { DialerPanel } from "./dialer-panel";
import { HOLD_MUSIC_TWIML } from "../constants";
import type { TwilioCall, TwilioPhoneNumber, FocusZone, CallUpdateParams } from "../types";

const ACTIVE_STATUSES = new Set(["ringing", "in-progress", "queued"]);

interface CallsViewProps {
  calls: TwilioCall[];
  callsLoading: boolean;
  callsError: string | null;
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  calling: boolean;
  callError: string | null;
  onCall: (from: string, to: string, url: string) => void;
  onUpdateCall: (sid: string, params: CallUpdateParams) => void;
  updatingCall: boolean;
  updateCallError: string | null;
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
  onUpdateCall,
  updatingCall,
  updateCallError,
}: CallsViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [heldCallSids, setHeldCallSids] = useState<Set<string>>(new Set());
  // Track original TwiML URLs for calls we initiated, so we can resume them
  const callUrlMapRef = useRef<Map<string, string>>(new Map());

  // Sort: active calls first, then history
  const sortedCalls = useMemo(() => {
    const active = calls.filter((c) => ACTIVE_STATUSES.has(c.status));
    const history = calls.filter((c) => !ACTIVE_STATUSES.has(c.status));
    return [...active, ...history];
  }, [calls]);

  const handleCall = useCallback(
    (from: string, to: string, url: string) => {
      // We'll track this URL after the call is created.
      // For now store the "to" number temporarily so we can map it later.
      // Since we don't have the SID yet, we store via a post-call lookup.
      callUrlMapRef.current.set(`pending:${to}`, url);
      onCall(from, to, url);
    },
    [onCall]
  );

  // After calls refresh, try to associate pending URLs with new call SIDs
  useEffect(() => {
    const pending = callUrlMapRef.current;
    for (const call of sortedCalls) {
      if (ACTIVE_STATUSES.has(call.status) && !pending.has(call.sid)) {
        const key = `pending:${call.to}`;
        if (pending.has(key)) {
          pending.set(call.sid, pending.get(key)!);
          pending.delete(key);
        }
      }
    }
  }, [sortedCalls]);

  const handleEndCall = useCallback(
    (sid: string) => {
      if (updatingCall) return;
      onUpdateCall(sid, { status: "completed" });
      // Clean up hold state
      setHeldCallSids((prev) => {
        const next = new Set(prev);
        next.delete(sid);
        return next;
      });
    },
    [onUpdateCall, updatingCall]
  );

  const handleHoldCall = useCallback(
    (sid: string) => {
      if (updatingCall) return;
      onUpdateCall(sid, { twiml: HOLD_MUSIC_TWIML });
      setHeldCallSids((prev) => new Set(prev).add(sid));
    },
    [onUpdateCall, updatingCall]
  );

  const handleResumeCall = useCallback(
    (sid: string) => {
      if (updatingCall) return;
      const originalUrl = callUrlMapRef.current.get(sid);
      if (!originalUrl) return; // Can't resume calls we didn't initiate
      onUpdateCall(sid, { url: originalUrl });
      setHeldCallSids((prev) => {
        const next = new Set(prev);
        next.delete(sid);
        return next;
      });
    },
    [onUpdateCall, updatingCall]
  );

  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <CallList
        calls={sortedCalls}
        loading={callsLoading}
        error={callsError}
        focused={zone === "call-list"}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
        heldCallSids={heldCallSids}
        onEndCall={handleEndCall}
        onHoldCall={handleHoldCall}
        onResumeCall={handleResumeCall}
      />
      <DialerPanel
        phoneNumbers={phoneNumbers}
        zone={zone}
        calling={calling}
        callError={callError || updateCallError}
        onCall={handleCall}
      />
    </box>
  );
}
