import fs from "node:fs/promises";

export async function albumArtToBase64(artUrl) {
  if (!artUrl) return null;

  const url = new URL(artUrl);

  let buffer;
  let contentType;

  if (url.protocol === "file:") {
    const filename = url.pathname;

    buffer = await fs.readFile(filename);

    const ext = filename.split(".").pop()?.toLowerCase();

    contentType =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "application/octet-stream";
  } else if (
    url.protocol === "http:" ||
    url.protocol === "https:"
  ) {
    const response = await fetch(artUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch album art: ${response.status}`
      );
    }

    buffer = Buffer.from(await response.arrayBuffer());

    contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";
  } else {
    throw new Error(`Unsupported artwork URL: ${url.protocol}`);
  }

  return `data:${contentType};base64,${buffer.toString("base64")}`;
}
