import type { LedState } from "./state";

import ledSvgString from "./led.svg";

export const getLedSvgString = (state: LedState) => {
  return ledSvgString.replace(
    /radial-gradient/g,
    `radial-gradient-${state.pin}`
  );
};
