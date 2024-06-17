import type { LedState } from "./state";

import ledSvgString from "./newled.svg?raw";

export const getLedSvgString = (state: LedState) => {
  return ledSvgString;
};
