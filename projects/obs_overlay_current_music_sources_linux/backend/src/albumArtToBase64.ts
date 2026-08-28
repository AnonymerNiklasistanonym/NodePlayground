import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGES: string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
] as const;

export async function albumArtToBase64(artUrl: string) {
  if (!artUrl) return null;

  const url = new URL(artUrl);

  let buffer;
  let contentType;

  if (url.protocol === "file:") {
    const filename = fileURLToPath(url);
    buffer = await fs.readFile(filename);
    const type = await fileTypeFromBuffer(buffer);
    // Make sure that reading arbitrary files will only allow arbitrary image files
    if (!type || !ALLOWED_IMAGES.includes(type.mime)) {
      throw new Error("Not a supported image");
    }
    contentType = type.mime;
  } else if (url.protocol === "http:" || url.protocol === "https:") {
    const response = await fetch(artUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch album art: ${response.status}`);
    }

    buffer = Buffer.from(await response.arrayBuffer());

    contentType = response.headers.get("content-type") || "application/octet-stream";
  } else {
    throw new Error(`Unsupported artwork URL: ${url.protocol}`);
  }

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}
