import express, { type Request, type Response } from "express";
import path from "node:path";
import { albumArtToBase64 } from "./albumArtToBase64.js";
import { ErrorExecCommand, execCommand } from "./execCommand.js";
import type { MediaSource } from "./types.ts";

const path_bin = path.join(
  import.meta.dirname,
  "../../current_music_sources_linux/target/release/current_music_sources_linux",
);
const app = express();

//app.use((req, _res, next) => {
//    console.log(`${req.method} ${req.url} ${JSON.stringify(req.headers)}`);
//    next();
//});

// --- Core Logic ---

/**
 * Transforms a list of players by fetching and encoding artwork URLs.
 */
async function convertArtUrl(players: MediaSource[]): Promise<MediaSource[]> {
  return Promise.all(
    players.map(async (player) => {
      if (!player.track || !player.track.art_url) {
        return player;
      }

      try {
        const base64Art = await albumArtToBase64(player.track.art_url);
        return {
          ...player,
          track: {
            ...player.track,
            art_url: base64Art,
          },
        };
      } catch (err) {
        console.error(`Failed to load artwork for ${player.identity}:`, (err as Error).message);

        return {
          ...player,
          track: {
            ...player.track,
            art_url: null,
          },
        };
      }
    }),
  );
}

/**
 * API endpoint to fetch and transform media data.
 */
app.get("/api/current_music_sources_linux", async (_req: Request, res: Response) => {
  try {
    const stdout = await execCommand(path_bin);
    const json: MediaSource[] = JSON.parse(stdout);
    const transformed = await convertArtUrl(json);
    res.json(transformed);
    console.log(
      transformed.length,
      transformed.map((a) => ({ id: a.identity, title: a.track?.title })),
    );
  } catch (err) {
    res.status(500).json({
      error: "Media command did not return valid JSON",
      message: err instanceof Error ? err.message : "Unknown JSON parsing error",
      stdout: err instanceof ErrorExecCommand ? err.stdout : undefined,
      stderr: err instanceof ErrorExecCommand ? err.stderr : undefined,
      code: err instanceof ErrorExecCommand ? err.code : undefined,
    });
  }
});

app.listen(5173, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server running on http://localhost:5173");
});
