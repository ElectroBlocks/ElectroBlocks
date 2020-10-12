import type { LedColorState } from "./state";

export const getLedColorId = (state: LedColorState) => {
  return `${state.type}_${state.pictureType}_${state.redPin}_${state.greenPin}_${state.bluePin}`;
};
