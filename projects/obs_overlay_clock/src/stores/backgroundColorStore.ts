import { createColorStore } from "./generic/colorStore";

export const BACKGROUND_COLOR_DEFAULT = "#000000bf" as const;

export const useBackgroundColorStore = createColorStore(
  "backgroundColor",
  BACKGROUND_COLOR_DEFAULT,
);
