import { getUrlParameter, updateUrlParameter } from "../helper/urlParameter";
import { create } from "zustand";

interface CountryStore {
  country: string | null;
  setCountry: (country: string | null) => void;
}

export const useCountryStore = create<CountryStore>((set) => ({
  country: getUrlParameter("country"),
  setCountry: (country) => {
    updateUrlParameter("country", country);
    set({ country });
  },
}));
