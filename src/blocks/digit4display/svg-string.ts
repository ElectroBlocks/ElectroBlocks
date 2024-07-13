import digitdisplay from "./digitdisplay.svg?raw";
import digitaldisplay_single from "./digitaldisplay_single_v2.svg?raw";
import type { DigitilDisplayState } from "./state";

export const getDigitalDisplaySvg = (state: DigitilDisplayState) => {
  return state.componentType === "MULTIPLE"
    ? digitdisplay
    : digitaldisplay_single;
};
