import type { TwilioCall, CliResult } from "../types";
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
