import { useState, useCallback } from "react";
import { useFocus } from "./hooks/use-focus";
import { useMessages } from "./hooks/use-messages";
import { useCalls } from "./hooks/use-calls";
import { usePhoneNumbers } from "./hooks/use-phone-numbers";
import { useSendMessage } from "./hooks/use-send-message";
import { useMakeCall } from "./hooks/use-make-call";
import { useUpdateNumber } from "./hooks/use-update-number";
import { useProfiles } from "./hooks/use-profiles";
import { useSwitchProfile } from "./hooks/use-switch-profile";
import { TopBar } from "./components/top-bar";
import { StatusBar } from "./components/status-bar";
import { MessagesView } from "./components/messages-view";
import { CallsView } from "./components/calls-view";
import { NumbersView } from "./components/numbers-view";
import { useDebuggerLogs } from "./hooks/use-debugger-logs";
import { LogsView } from "./components/logs-view";
import { AccountView } from "./components/account-view";
import { colors } from "./constants";
import type { TabId } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>("messages");
  const { zone, focusZone } = useFocus(activeTab);
  const { messages, loading: messagesLoading, error: messagesError, lastRefresh: messagesLastRefresh, refresh: refreshMessages } = useMessages();
  const { calls, loading: callsLoading, error: callsError, lastRefresh: callsLastRefresh, refresh: refreshCalls } = useCalls();
  const {
    numbers: phoneNumbers,
    loading: numbersLoading,
    error: numbersError,
    lastRefresh: numbersLastRefresh,
    refresh: refreshNumbers,
  } = usePhoneNumbers();
  const {
    logs: debuggerLogs,
    loading: logsLoading,
    error: logsError,
    lastRefresh: logsLastRefresh,
    refresh: refreshLogs,
  } = useDebuggerLogs();
  const {
    profiles,
    balance,
    usage,
    loading: profilesLoading,
    error: profilesError,
    lastRefresh: profilesLastRefresh,
    refresh: refreshProfiles,
  } = useProfiles();

  const onSendSuccess = useCallback(() => {
    refreshMessages();
  }, [refreshMessages]);

  const { send, sending, error: sendError } = useSendMessage({ onSuccess: onSendSuccess });

  const onCallSuccess = useCallback(() => {
    refreshCalls();
  }, [refreshCalls]);

  const { call, calling, error: callError } = useMakeCall({ onSuccess: onCallSuccess });

  const onUpdateSuccess = useCallback(() => {
    refreshNumbers();
  }, [refreshNumbers]);

  const { update: updateNumber, updating, error: updateError } = useUpdateNumber({
    onSuccess: onUpdateSuccess,
  });

  const onSwitchSuccess = useCallback(() => {
    refreshProfiles();
    refreshMessages();
    refreshCalls();
    refreshNumbers();
    refreshLogs();
  }, [refreshProfiles, refreshMessages, refreshCalls, refreshNumbers, refreshLogs]);

  const { switchProfile: doSwitchProfile, switching, error: switchError } = useSwitchProfile({
    onSuccess: onSwitchSuccess,
  });

  const handleUpdate = useCallback(
    (sid: string, updates: { friendlyName?: string; voiceUrl?: string; smsUrl?: string }) => {
      updateNumber(sid, updates);
    },
    [updateNumber]
  );

  const handleSend = useCallback(
    (from: string, to: string, body: string) => {
      send(from, to, body);
    },
    [send]
  );

  const handleCall = useCallback(
    (from: string, to: string, url: string) => {
      call(from, to, url);
    },
    [call]
  );

  const lastRefresh =
    activeTab === "calls" ? callsLastRefresh :
    activeTab === "numbers" ? numbersLastRefresh :
    activeTab === "logs" ? logsLastRefresh :
    activeTab === "account" ? profilesLastRefresh :
    messagesLastRefresh;

  const activeError =
    activeTab === "calls" ? callsError :
    activeTab === "numbers" ? numbersError :
    activeTab === "logs" ? logsError :
    activeTab === "account" ? profilesError :
    messagesError;

  return (
    <box
      style={{
        flexDirection: "column",
        backgroundColor: colors.bg,
        width: "100%",
        height: "100%",
      }}
    >
      <TopBar
        activeTab={activeTab}
        focused={zone === "tabs"}
        onTabChange={setActiveTab}
      />

      {activeTab === "messages" ? (
        <MessagesView
          messages={messages}
          messagesLoading={messagesLoading}
          messagesError={messagesError}
          phoneNumbers={phoneNumbers}
          zone={zone}
          sending={sending}
          sendError={sendError}
          onSend={handleSend}
        />
      ) : activeTab === "calls" ? (
        <CallsView
          calls={calls}
          callsLoading={callsLoading}
          callsError={callsError}
          phoneNumbers={phoneNumbers}
          zone={zone}
          calling={calling}
          callError={callError}
          onCall={handleCall}
        />
      ) : activeTab === "numbers" ? (
        <NumbersView
          numbers={phoneNumbers}
          numbersLoading={numbersLoading}
          numbersError={numbersError}
          zone={zone}
          updating={updating}
          updateError={updateError}
          onUpdate={handleUpdate}
        />
      ) : activeTab === "logs" ? (
        <LogsView
          logs={debuggerLogs}
          logsLoading={logsLoading}
          logsError={logsError}
          zone={zone}
        />
      ) : (
        <AccountView
          profiles={profiles}
          balance={balance}
          usage={usage}
          profilesLoading={profilesLoading}
          profilesError={profilesError}
          phoneNumberCount={phoneNumbers.length}
          zone={zone}
          switching={switching}
          switchError={switchError}
          onSwitch={doSwitchProfile}
        />
      )}

      <StatusBar
        lastRefresh={lastRefresh}
        sending={sending || calling || updating || switching}
        error={activeError}
      />
    </box>
  );
}
