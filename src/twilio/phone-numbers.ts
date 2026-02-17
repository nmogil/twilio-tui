import type { TwilioPhoneNumber, CliResult } from "../types";
import { execTwilio } from "./cli";

export async function listPhoneNumbers(): Promise<CliResult<TwilioPhoneNumber[]>> {
  return execTwilio<TwilioPhoneNumber[]>(["phone-numbers", "list"]);
}
