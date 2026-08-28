import { compile } from "json-schema-to-typescript";
import fs from "node:fs/promises";
import path from "path";
import { execCommand } from "./execCommand";

const path_bin = path.join(
  import.meta.dirname,
  "../../current_music_sources_linux/target/release/current_music_sources_linux",
);
const stdout = await execCommand(path_bin, ["--schema"]);
const schema = JSON.parse(stdout);
const ts = await compile(schema, "Players");
await fs.writeFile(path.join(import.meta.dirname, "../src/helper/types.ts"), ts);
