import { spawn } from "node:child_process";

export class ErrorExecCommand extends Error {
  public readonly code: number | null;
  public readonly stdout: string;
  public readonly stderr: string;

  constructor(message: string, code: number | null, stdout: string, stderr: string) {
    super(message);

    this.name = "CommandError";
    this.code = code;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

/**
 * Execute a local command without a shell and get the response string (stdout)
 * @param command Command/file (path)
 * @param args Arguments for that command/file
 * @returns stdout of the command/file
 */
export function execCommand(command: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new ErrorExecCommand(
            `Command failed with exit code ${code}: ${stderr}`,
            code,
            stderr,
            stdout,
          ),
        );
        return;
      }

      resolve(stdout);
    });
  });
}
