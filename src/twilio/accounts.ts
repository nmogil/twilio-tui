import type { TwilioProfile, TwilioBalance, TwilioUsageRecord, CliResult } from "../types";
import { execTwilio } from "./cli";

async function execTwilioRaw(args: string[]): Promise<CliResult<string>> {
  try {
    const proc = Bun.spawn(["twilio", ...args], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const [stdoutText, stderrText] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);

    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      const errorMsg = stderrText.trim() || `twilio exited with code ${exitCode}`;
      return { ok: false, error: errorMsg };
    }

    return { ok: true, data: stdoutText.trim() };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error executing twilio CLI";
    return { ok: false, error: message };
  }
}

function parseProfilesTable(text: string): TwilioProfile[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const profiles: TwilioProfile[] = [];

  for (const line of lines) {
    // Skip header/separator lines
    if (line.startsWith("ID") || line.startsWith("─") || line.startsWith("-")) continue;

    const parts = line.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) continue;

    const id = parts[0];
    const accountSid = parts[1];
    const active = line.includes("true") || line.includes("*");

    profiles.push({ id, accountSid, active });
  }

  return profiles;
}

export async function listProfiles(): Promise<CliResult<TwilioProfile[]>> {
  // Try JSON output first
  const jsonResult = await execTwilio<TwilioProfile[]>(["profiles", "list"]);
  if (jsonResult.ok && Array.isArray(jsonResult.data) && jsonResult.data.length > 0) {
    return jsonResult;
  }

  // Fall back to text parsing
  const rawResult = await execTwilioRaw(["profiles", "list"]);
  if (!rawResult.ok) {
    return rawResult;
  }

  const profiles = parseProfilesTable(rawResult.data);
  if (profiles.length === 0) {
    return { ok: false, error: "No profiles found. Run `twilio profiles create` to set up a profile." };
  }

  return { ok: true, data: profiles };
}

export async function fetchBalance(): Promise<CliResult<TwilioBalance>> {
  return execTwilio<TwilioBalance>(["api", "core", "balance", "fetch"]);
}

export async function listUsageRecords(): Promise<CliResult<TwilioUsageRecord[]>> {
  return execTwilio<TwilioUsageRecord[]>([
    "api",
    "core",
    "usage",
    "records",
    "list",
    "--limit",
    "50",
  ]);
}

export async function switchProfile(id: string): Promise<CliResult<string>> {
  return execTwilioRaw(["profiles", "use", id]);
}
