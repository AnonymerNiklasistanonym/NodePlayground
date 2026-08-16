import { create } from "zustand";

interface TimeStore {
  timeString: string;
  setTimeString: (timeString: string) => void;
}

export const TIME_STRING_DEFAULT = "dd/MM/yyyy HH:mm:ss OOOO";

export const useTimeStore = create<TimeStore>((set) => ({
  timeString: new URLSearchParams(window.location.search).get("timeString") || TIME_STRING_DEFAULT,
  setTimeString: (timeString) => {
    const url = new URL(window.location.href);

    if (timeString) {
      url.searchParams.set("timeString", timeString);
    } else {
      url.searchParams.delete("timeString");
    }

    window.history.replaceState({}, "", url);

    set({ timeString });
  },
}));
