import type { TwilioPhoneNumber, CliResult } from "../types";
import { execTwilio } from "./cli";

export async function listPhoneNumbers(): Promise<CliResult<TwilioPhoneNumber[]>> {
  return execTwilio<TwilioPhoneNumber[]>(["phone-numbers", "list"]);
}

export async function updatePhoneNumber(
  sid: string,
  updates: {
    friendlyName?: string;
    voiceUrl?: string;
    smsUrl?: string;
  }
): Promise<CliResult<TwilioPhoneNumber>> {
  const args = ["api", "core", "incoming-phone-numbers", "update", "--sid", sid];

  if (updates.friendlyName !== undefined) {
    args.push("--friendly-name", updates.friendlyName);
  }
  if (updates.voiceUrl !== undefined) {
    args.push("--voice-url", updates.voiceUrl);
  }
  if (updates.smsUrl !== undefined) {
    args.push("--sms-url", updates.smsUrl);
  }

  return execTwilio<TwilioPhoneNumber>(args);
}
