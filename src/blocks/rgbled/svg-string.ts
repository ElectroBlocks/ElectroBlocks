import type { LedColorState } from "./state";

import rgbLed from "./rgbled.svg?raw";

export const getLedColorSvgString = (state: LedColorState) => {
  return rgbLed;
};
