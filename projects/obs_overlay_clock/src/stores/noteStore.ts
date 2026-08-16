import { create } from "zustand";

interface NoteStore {
  note: string | null;
  setNote: (note: string | null) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  note: new URLSearchParams(window.location.search).get("note"),
  setNote: (note) => {
    const url = new URL(window.location.href);

    if (note && note.trim().length > 0) {
      url.searchParams.set("note", note);
    } else {
      url.searchParams.delete("note");
    }

    window.history.replaceState({}, "", url);

    set({ note });
  },
}));
