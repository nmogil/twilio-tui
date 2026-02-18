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

export interface AvailablePhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  isoCountry: string;
  postalCode: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
}

export type NumbersMode = "manage" | "search";

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

export interface TwilioProfile {
  id: string;
  accountSid: string;
  active: boolean;
}

export interface TwilioBalance {
  balance: string;
  currency: string;
  accountSid: string;
}

export interface TwilioUsageRecord {
  category: string;
  description: string;
  count: string;
  countUnit: string;
  price: string;
  priceUnit: string;
  startDate: string;
  endDate: string;
  usage: string;
  usageUnit: string;
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
  | "search-country"
  | "search-area-code"
  | "search-contains"
  | "search-results"
  | "purchase-panel"
  | "log-list"
  | "log-detail"
  | "profile-list"
  | "account-detail";

export type TabId = "messages" | "calls" | "numbers" | "logs" | "account";

export type CliResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
