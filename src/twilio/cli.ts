import type { CliResult } from "../types";

export async function execTwilio<T>(args: string[]): Promise<CliResult<T>> {
  try {
    const proc = Bun.spawn(["twilio", ...args, "-o", "json"], {
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

    const trimmed = stdoutText.trim();
    if (!trimmed || !trimmed.startsWith("[") && !trimmed.startsWith("{")) {
      return { ok: true, data: [] as unknown as T };
    }

    const data = JSON.parse(trimmed) as T;
    return { ok: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error executing twilio CLI";
    return { ok: false, error: message };
  }
}
