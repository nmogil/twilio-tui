import type { TwilioMessage, CliResult } from "../types";
import { execTwilio } from "./cli";
import { MAX_MESSAGES } from "../constants";

export async function listMessages(): Promise<CliResult<TwilioMessage[]>> {
  return execTwilio<TwilioMessage[]>([
    "api",
    "core",
    "messages",
    "list",
    "--limit",
    String(MAX_MESSAGES),
  ]);
}

export async function sendMessage(
  from: string,
  to: string,
  body: string
): Promise<CliResult<TwilioMessage>> {
  return execTwilio<TwilioMessage>([
    "api",
    "core",
    "messages",
    "create",
    "--from",
    from,
    "--to",
    to,
    "--body",
    body,
  ]);
}
