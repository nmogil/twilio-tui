import type { TwilioCall, CallUpdateParams, CliResult } from "../types";
import { execTwilio } from "./cli";
import { MAX_CALLS } from "../constants";

export async function listCalls(): Promise<CliResult<TwilioCall[]>> {
  return execTwilio<TwilioCall[]>([
    "api",
    "core",
    "calls",
    "list",
    "--limit",
    String(MAX_CALLS),
  ]);
}

export async function makeCall(
  from: string,
  to: string,
  url: string
): Promise<CliResult<TwilioCall>> {
  return execTwilio<TwilioCall>([
    "api",
    "core",
    "calls",
    "create",
    "--from",
    from,
    "--to",
    to,
    "--url",
    url,
  ]);
}

export async function updateCall(
  sid: string,
  params: CallUpdateParams
): Promise<CliResult<TwilioCall>> {
  const args = ["api", "core", "calls", "update", "--sid", sid];

  if (params.status) {
    args.push("--status", params.status);
  }
  if (params.twiml) {
    args.push("--twiml", params.twiml);
  }
  if (params.url) {
    args.push("--url", params.url);
  }

  return execTwilio<TwilioCall>(args);
}
