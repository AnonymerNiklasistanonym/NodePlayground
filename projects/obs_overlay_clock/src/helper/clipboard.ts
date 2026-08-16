/**
 * Copy the given content to the clipboard
 */
export async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    return;
  } catch (err) {
    console.error("Failed to use clipboard API:", err);
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return;
  } catch (err) {
    console.error("Fallback copy to clipboard failed:", err);
  }

  throw new Error("Unable to copy content to clipboard");
}
