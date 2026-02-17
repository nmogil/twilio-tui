export interface TwilioMessage {
  sid: string;
  from: string;
  to: string;
  body: string;
  status: string;
  direction: string;
  dateCreated: string;
  dateSent: string | null;
}

export interface TwilioPhoneNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
}

export type FocusZone =
  | "tabs"
  | "message-list"
  | "from-select"
  | "to-input"
  | "body-textarea";

export type TabId = "messages" | "calls" | "numbers" | "logs";

export type CliResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
