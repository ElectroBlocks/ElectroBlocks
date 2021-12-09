import type { FastLEDState } from "./state";

export const fastLEDId = (state: FastLEDState) => {
  return `${state.type}-${state.pins.sort().join("-")}-${state.numberOfLeds}`;
};
