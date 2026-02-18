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

export interface TwilioCall {
  sid: string;
  from: string;
  to: string;
  status: string;
  direction: string;
  duration: string | null;
  dateCreated: string;
  startTime: string | null;
  endTime: string | null;
}

export interface TwilioPhoneNumber {
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  voiceUrl: string | null;
  smsUrl: string | null;
  statusCallbackUrl: string | null;
}

export interface TwilioDebuggerLog {
  sid: string;
  accountSid: string;
  logLevel: string;
  alertText: string;
  dateCreated: string;
  dateUpdated: string;
  dateGenerated: string;
  errorCode: string;
  moreInfo: string;
  requestUrl: string;
  requestMethod: string;
  resourceSid: string | null;
  serviceSid: string | null;
  url: string;
}

export type FocusZone =
  | "tabs"
  | "message-list"
  | "from-select"
  | "to-input"
  | "body-textarea"
  | "call-list"
  | "dialer-from"
  | "dialer-to"
  | "dialer-url"
  | "number-list"
  | "number-friendly-name"
  | "number-voice-url"
  | "number-sms-url"
  | "log-list"
  | "log-detail";

export type TabId = "messages" | "calls" | "numbers" | "logs";

export type CliResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
