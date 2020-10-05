import { LedColorState } from "./state";

import rgbLedBreadboard from "./rgbled-breadboard.svg";
import rgbLedResistorBuiltIn from "./rgbled-resistorbuiltin.svg";

export const getLedColorSvgString = (state: LedColorState) => {
  return state.pictureType === "BREADBOARD"
    ? rgbLedBreadboard
    : rgbLedResistorBuiltIn;
};
