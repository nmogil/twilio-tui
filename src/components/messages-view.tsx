import { MessageList } from "./message-list";
import { ComposePanel } from "./compose-panel";
import type { TwilioMessage, TwilioPhoneNumber, FocusZone } from "../types";

interface MessagesViewProps {
  messages: TwilioMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  phoneNumbers: TwilioPhoneNumber[];
  zone: FocusZone;
  sending: boolean;
  sendError: string | null;
  onSend: (from: string, to: string, body: string) => void;
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
}: MessagesViewProps) {
  return (
    <box style={{ flexDirection: "row", flexGrow: 1 }}>
      <MessageList
        messages={messages}
        loading={messagesLoading}
        error={messagesError}
        focused={zone === "message-list"}
      />
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
