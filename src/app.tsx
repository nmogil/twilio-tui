import { useState, useCallback } from "react";
import { useFocus } from "./hooks/use-focus";
import { useMessages } from "./hooks/use-messages";
import { usePhoneNumbers } from "./hooks/use-phone-numbers";
import { useSendMessage } from "./hooks/use-send-message";
import { TopBar } from "./components/top-bar";
import { StatusBar } from "./components/status-bar";
import { MessagesView } from "./components/messages-view";
import { PlaceholderTab } from "./components/placeholder-tab";
import { colors } from "./constants";
import type { TabId } from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>("messages");
  const { zone, focusZone } = useFocus();
  const { messages, loading: messagesLoading, error: messagesError, lastRefresh, refresh } = useMessages();
  const { numbers: phoneNumbers } = usePhoneNumbers();

  const onSendSuccess = useCallback(() => {
    refresh();
  }, [refresh]);

  const { send, sending, error: sendError } = useSendMessage({ onSuccess: onSendSuccess });

  const handleSend = useCallback(
    (from: string, to: string, body: string) => {
      send(from, to, body);
    },
    [send]
  );

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
      ) : (
        <PlaceholderTab tabId={activeTab} />
      )}

      <StatusBar
        lastRefresh={lastRefresh}
        sending={sending}
        error={messagesError}
      />
    </box>
  );
}
