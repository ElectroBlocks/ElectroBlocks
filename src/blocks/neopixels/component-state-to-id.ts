import type { NeoPixelState } from "./state";

export const neoPixelId = (state: NeoPixelState) => {
  return `${state.type}-${state.pins.sort().join("-")}-${state.numberOfLeds}`;
};
