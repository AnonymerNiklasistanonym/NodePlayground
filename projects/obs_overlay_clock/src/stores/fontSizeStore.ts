import { getUrlParameter, updateUrlParameter } from "../helper/urlParameter";
import { create } from "zustand";

interface FontSizeStore {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
}

export const FONT_SIZE_DEFAULT = 1.5 as const;

const validateFontSize = (fontSize: number | null | string): number => {
  if (typeof fontSize === "string") {
    fontSize = Number(fontSize);
  }
  if (fontSize || fontSize === 0) {
    return Math.max(0.1, fontSize);
  }
  return FONT_SIZE_DEFAULT;
};

export const useFontSizeStore = create<FontSizeStore>((set) => ({
  fontSize: validateFontSize(getUrlParameter("fontSize")),
  setFontSize: (fontSize) => {
    const validatedFontSize = validateFontSize(fontSize);
    updateUrlParameter(
      "fontSize",
      fontSize !== FONT_SIZE_DEFAULT ? `${validatedFontSize}` : undefined,
    );
    set({ fontSize });
  },
}));
