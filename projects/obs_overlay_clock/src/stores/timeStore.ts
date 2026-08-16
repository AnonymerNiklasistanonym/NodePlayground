import { getUrlParameter, updateUrlParameter } from "../helper/urlParameter";
import { create } from "zustand";

interface TimeStore {
  timeString: string;
  setTimeString: (timeString: string) => void;
}

export const TIME_STRING_DEFAULT = "dd/MM/yyyy HH:mm:ss OOOO" as const;

export const useTimeStore = create<TimeStore>((set) => ({
  timeString: getUrlParameter("timeString") ?? TIME_STRING_DEFAULT,
  setTimeString: (timeString) => {
    updateUrlParameter("timeString", timeString !== TIME_STRING_DEFAULT ? timeString : undefined);
    set({ timeString });
  },
}));
