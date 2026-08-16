import { createColorStore } from "./generic/colorStore";

export const FONT_COLOR_DEFAULT = "#ffffff" as const;

export const useFontColorStore = createColorStore("fontColor", FONT_COLOR_DEFAULT);
