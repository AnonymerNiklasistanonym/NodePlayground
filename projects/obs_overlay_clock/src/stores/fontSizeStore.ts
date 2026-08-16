import { create } from "zustand";

interface FontSizeStore {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
}

export const FONT_SIZE_DEFAULT = 1.5;

export const useFontSizeStore = create<FontSizeStore>((set) => ({
  fontSize: Number(
    new URLSearchParams(window.location.search).get("fontSize") || FONT_SIZE_DEFAULT,
  ),
  setFontSize: (fontSize) => {
    const url = new URL(window.location.href);

    if (fontSize) {
      url.searchParams.set("fontSize", `${fontSize}`);
    } else {
      url.searchParams.delete("fontSize");
    }

    window.history.replaceState({}, "", url);

    set({ fontSize });
  },
}));
