import type { TwilioDebuggerLog, CliResult } from "../types";
import { execTwilio } from "./cli";

export async function listDebuggerLogs(): Promise<CliResult<TwilioDebuggerLog[]>> {
  return execTwilio<TwilioDebuggerLog[]>([
    "debugger",
    "logs",
    "list",
  ]);
}
