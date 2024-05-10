import type { LedColorState } from "./state";

import rgbLedBreadboard from "./rgbled-breadboard.svg?raw";
import rgbLedResistorBuiltIn from "./rgbled-resistorbuiltin.svg?raw";

export const getLedColorSvgString = (state: LedColorState) => {
  return state.pictureType === "BREADBOARD"
    ? rgbLedBreadboard
    : rgbLedResistorBuiltIn;
};
