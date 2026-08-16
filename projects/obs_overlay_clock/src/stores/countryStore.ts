import { create } from "zustand";

interface CountryStore {
  country: string | null;
  setCountry: (country: string | null) => void;
}

export const useCountryStore = create<CountryStore>((set) => ({
  country: new URLSearchParams(window.location.search).get("country"),

  setCountry: (country) => {
    const url = new URL(window.location.href);

    if (country) {
      url.searchParams.set("country", country);
    } else {
      url.searchParams.delete("country");
    }

    window.history.replaceState({}, "", url);

    set({ country });
  },
}));
