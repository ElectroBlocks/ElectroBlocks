import type { DigitilDisplayState } from "./state";

export const getDigitalDisplayId = (state: DigitilDisplayState) => {
  return `${state.type}-${state.componentType}-${state.pins.join(",")}`;
};
