import type { LedColorState } from "./state";

export const getLedColorId = (state: LedColorState) => {
  return `${state.type}_${state.pins.join("_")}`;
};
