import { useState, useMemo, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { ConversationList } from "./conversation-list";
import { ThreadView } from "./thread-view";
import { ComposePanel } from "./compose-panel";
import { groupConversations } from "../utils/group-conversations";
import type { TwilioMessage, TwilioPhoneNumber, FocusZone, MessagesMode } from "../types";

interface MessagesViewProps {
  messages: TwilioMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  sending: boolean;
  sendError: string | null;
  onSend: (from: string, to: string, body: string) => void;
  messagesMode: MessagesMode;
  onModeChange: (mode: MessagesMode) => void;
}

export function MessagesView({
  messages,
  messagesLoading,
  messagesError,
  phoneNumbers,
  zone,
  sending,
  sendError,
  onSend,
  messagesMode,
  onModeChange,
}: MessagesViewProps) {
  const conversations = useMemo(() => groupConversations(messages), [messages]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedContactNumber, setSelectedContactNumber] = useState<string | null>(null);

  // Stable selection: when conversations re-group after poll, re-find contact index
  useEffect(() => {
    if (selectedContactNumber) {
      const idx = conversations.findIndex((c) => c.contactNumber === selectedContactNumber);
      if (idx >= 0) {
        setSelectedIndex(idx);
      } else {
        // Contact no longer in list, reset
        setSelectedIndex(0);
        setSelectedContactNumber(conversations[0]?.contactNumber ?? null);
      }
    } else if (conversations.length > 0) {
      setSelectedContactNumber(conversations[0].contactNumber);
    }
  }, [conversations, selectedContactNumber]);

  const handleSelectedIndexChange = (index: number) => {
    setSelectedIndex(index);
    setSelectedContactNumber(conversations[index]?.contactNumber ?? null);
  };

  const selectedConversation = conversations[selectedIndex] ?? null;

  // N key: enter compose mode from conversation-list
  // M key: return to conversations from compose zones
  useKeyboard((key) => {
    if (messagesMode === "conversations" && zone === "conversation-list" && key.name === "n") {
      onModeChange("compose");
    }
    if (
      messagesMode === "compose" &&
      (zone === "from-select" || zone === "to-input" || zone === "body-textarea") &&
      key.name === "m"
    ) {
      onModeChange("conversations");
    }
  });

  if (messagesMode === "compose") {
    return (
      <box style={{ flexDirection: "row", flexGrow: 1 }}>
        <ComposePanel
          phoneNumbers={phoneNumbers}
          zone={zone}
          sending={sending}
          sendError={sendError}
          onSend={onSend}
        />
      </box>
    );
  }

  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <ConversationList
        conversations={conversations}
        loading={messagesLoading}
        error={messagesError}
        focused={zone === "conversation-list"}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={handleSelectedIndexChange}
      />
      <ThreadView
        conversation={selectedConversation}
        phoneNumbers={phoneNumbers}
        zone={zone}
        sending={sending}
        sendError={sendError}
        onSend={onSend}
      />
    </box>
  );
}
