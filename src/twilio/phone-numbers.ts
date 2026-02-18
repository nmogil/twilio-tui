import type { TwilioPhoneNumber, AvailablePhoneNumber, CliResult } from "../types";
import { execTwilio } from "./cli";
import { MAX_SEARCH_RESULTS } from "../constants";

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

export async function searchAvailableNumbers(
  countryCode: string,
  areaCode?: string,
  contains?: string
): Promise<CliResult<AvailablePhoneNumber[]>> {
  const args = [
    "api", "core", "available-phone-numbers",
    countryCode, "local", "list",
    "--limit", String(MAX_SEARCH_RESULTS),
  ];
  if (areaCode) args.push("--area-code", areaCode);
  if (contains) args.push("--contains", contains);
  return execTwilio<AvailablePhoneNumber[]>(args);
}

export async function purchasePhoneNumber(
  phoneNumber: string
): Promise<CliResult<TwilioPhoneNumber>> {
  return execTwilio<TwilioPhoneNumber>([
    "api", "core", "incoming-phone-numbers", "create",
    "--phone-number", phoneNumber,
  ]);
}
