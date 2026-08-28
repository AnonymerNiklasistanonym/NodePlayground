export function formatTime(us: number) {
  const seconds = Math.floor((us || 0) / 1_000_000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}
