import { getUrlParameter, updateUrlParameter } from "../helper/urlParameter";
import { create } from "zustand";

interface FontFamilyStore {
  fontFamily: string;
  setFontFamily: (fontFamily: string | null) => void;
}

export const FONT_FAMILY_DEFAULT = "monospace" as const;

export const useFontFamilyStore = create<FontFamilyStore>((set) => ({
  fontFamily: getUrlParameter("fontFamily") ?? FONT_FAMILY_DEFAULT,
  setFontFamily: (fontFamily) => {
    updateUrlParameter(
      "fontFamily",
      fontFamily && fontFamily.trim().toLowerCase() !== FONT_FAMILY_DEFAULT
        ? fontFamily
        : undefined,
    );
    set({ fontFamily: fontFamily ?? FONT_FAMILY_DEFAULT });
  },
}));
