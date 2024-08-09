import type { LedState } from "./state";

export const getLedId = (state: LedState) => {
  return `${state.type}_${state.color.replace("#", "")}_${state.pin}`;
};
