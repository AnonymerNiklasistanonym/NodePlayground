import { getUrlParameter, updateUrlParameter } from "../../helper/urlParameter";
import { create } from "zustand";

interface ColorStore {
  color: string;
  setColor: (newColor: string | null) => void;
}

const HEX_COLOR_REGEX = /^#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?)$/;

const validateColor = (color: string | null, defaultColor: string): string => {
  if (color && color.trim().length > 0 && HEX_COLOR_REGEX.test(color.trim())) {
    return color.trim().toLocaleLowerCase();
  }
  return defaultColor;
};

export const createColorStore = (key: string, defaultValue: string) => {
  return create<ColorStore>((set) => ({
    color: validateColor(getUrlParameter(key), defaultValue),
    setColor: (newColor: string | null) => {
      const validatedColor = validateColor(newColor, defaultValue);
      updateUrlParameter(key, validatedColor !== defaultValue ? validatedColor : undefined);
      set({ color: validatedColor });
    },
  }));
};
