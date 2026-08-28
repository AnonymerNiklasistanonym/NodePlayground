import { spawn } from "node:child_process";

export class ErrorExecCommand extends Error {
  public readonly code: number;
  public readonly stdout: string;
  public readonly stderr: string;

  constructor(message: string, code: number, stdout: string, stderr: string) {
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

    child.stdout.on("data", (chunk: any) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: any) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);

    child.on("close", (code: number) => {
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
