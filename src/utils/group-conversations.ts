import type { TwilioMessage, Conversation } from "../types";

export function groupConversations(messages: TwilioMessage[]): Conversation[] {
  const map = new Map<string, TwilioMessage[]>();

  for (const msg of messages) {
    const isInbound = msg.direction.includes("inbound");
    const contactNumber = isInbound ? msg.from : msg.to;
    const existing = map.get(contactNumber);
    if (existing) {
      existing.push(msg);
    } else {
      map.set(contactNumber, [msg]);
    }
  }

  const conversations: Conversation[] = [];
  for (const [contactNumber, msgs] of map) {
    msgs.sort(
      (a, b) =>
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );
    conversations.push({
      contactNumber,
      lastMessage: msgs[msgs.length - 1],
      messages: msgs,
      messageCount: msgs.length,
    });
  }

  // Most recent conversation first
  conversations.sort(
    (a, b) =>
      new Date(b.lastMessage.dateCreated).getTime() -
      new Date(a.lastMessage.dateCreated).getTime()
  );

  return conversations;
}
