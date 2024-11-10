import type { LedColorState } from "./state";

export const getLedColorId = (state: LedColorState) => {
  console.log(`${state.type}_${state.pins.join("_")}`);
  return `${state.type}_${state.pins.join("_")}`;
};
