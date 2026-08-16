import express from "express"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"
import os from "node:os"
import { createServer as createViteServer } from "vite"
import { albumArtToBase64 } from "./albumArtToBase64.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const path_bin = path.join(os.homedir(), "Documents/GitHubSSH/RustPlayground/projects/current_music_sources_linux/target/release/current_music_sources_linux")
const app = express()

async function transformPlayers(players) {
  return Promise.all(
    players.map(async player => {
      if (!player.track?.art_url) {
        return player;
      }

      try {
        return {
          ...player,
          track: {
            ...player.track,
            art_url: await albumArtToBase64(
              player.track.art_url
            )
          }
        };
      } catch (err) {
        console.error(
          `Failed to load artwork for ${player.identity}:`,
          err.message
        );

        return {
          ...player,
          track: {
            ...player.track,
            art_url: null
          }
        };
      }
    })
  );
}

app.get("/api/media", (req, res) => {
  const child = spawn(
    path_bin,
    [],
    {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    }
  )

  let stdout = ""
  let stderr = ""

  child.stdout.on("data", chunk => {
    stdout += chunk
  })

  child.stderr.on("data", chunk => {
    stderr += chunk
  })

  child.on("error", err => {
    res.status(500).json({
      error: "Failed to execute media command",
      message: err.message
    })
  })

  child.on("close", async code => {
    if (res.headersSent) return

    if (code !== 0) {
      return res.status(500).json({
        error: "Media command failed",
        code,
        stderr
      })
    }

    try {
      const json = JSON.parse(stdout)
      const transformed = await transformPlayers(json);
      res.json(transformed)
    } catch (err) {
      res.status(500).json({
        error: "Media command did not return valid JSON",
        message: err.message,
        stdout
      })
    }
  })
})

const isProduction = process.env.NODE_ENV === "production"

if (!isProduction) {
  const vite = await createViteServer({
    server: {
      middlewareMode: true
    },
    appType: "spa"
  })

  app.use(vite.middlewares)
} else {
  app.use(express.static(path.join(__dirname, "dist")))

  app.get("*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
  })
}

app.listen(5173, () => {
  console.log("http://localhost:5173")
})
