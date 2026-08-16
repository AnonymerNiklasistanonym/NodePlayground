import { getUrlParameter, updateUrlParameter } from "../helper/urlParameter";
import { create } from "zustand";

interface NoteStore {
  note: string | null;
  setNote: (note: string | null) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  note: getUrlParameter("note"),
  setNote: (note) => {
    updateUrlParameter("note", note);
    set({ note });
  },
}));
