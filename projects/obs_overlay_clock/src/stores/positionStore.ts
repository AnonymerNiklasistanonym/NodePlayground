import { getUrlParameter, updateUrlParameter } from "../helper/urlParameter";
import { create } from "zustand";

export const positionsVertical = ["top", "bottom"] as const;
export const positionsHorizontal = ["left", "center", "right"] as const;

export type PositionVertical = (typeof positionsVertical)[number];
export type PositionHorizontal = (typeof positionsHorizontal)[number];

interface PositionStore {
  positionVertical: PositionVertical;
  positionHorizontal: PositionHorizontal;
  setPositionVertical: (positionVertical: PositionVertical) => void;
  setPositionHorizontal: (positionHorizontal: PositionHorizontal) => void;
}

export const POSITION_VERTICAL_DEFAULT: PositionVertical = "bottom" as const;
export const POSITION_HORIZONTAL_DEFAULT: PositionHorizontal = "right" as const;

const validatePositionVertical = (positionVertical: string | null): PositionVertical => {
  if (positionVertical && positionsVertical.includes(positionVertical as PositionVertical)) {
    return positionVertical as PositionVertical;
  }
  return POSITION_VERTICAL_DEFAULT;
};

const validatePositionHorizontal = (positionHorizontal: string | null): PositionHorizontal => {
  if (
    positionHorizontal &&
    positionsHorizontal.includes(positionHorizontal as PositionHorizontal)
  ) {
    return positionHorizontal as PositionHorizontal;
  }
  return POSITION_HORIZONTAL_DEFAULT;
};

export const usePositionStore = create<PositionStore>((set) => ({
  positionVertical: validatePositionVertical(getUrlParameter("positionVertical")),
  positionHorizontal: validatePositionHorizontal(getUrlParameter("positionHorizontal")),
  setPositionVertical: (positionVertical) => {
    const validatedPositionVertical = validatePositionVertical(positionVertical);
    updateUrlParameter(
      "positionVertical",
      validatedPositionVertical !== POSITION_VERTICAL_DEFAULT
        ? validatedPositionVertical
        : undefined,
    );
    set({ positionVertical });
  },
  setPositionHorizontal: (positionHorizontal) => {
    const validatedPositionHorizontal = validatePositionHorizontal(positionHorizontal);
    updateUrlParameter(
      "positionHorizontal",
      validatedPositionHorizontal !== POSITION_HORIZONTAL_DEFAULT
        ? validatedPositionHorizontal
        : undefined,
    );
    set({ positionHorizontal });
  },
}));
