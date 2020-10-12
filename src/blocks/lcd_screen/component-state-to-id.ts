import type { LCDScreenState } from "./state";

export const lcdStateId = (state: LCDScreenState) => {
  return `${state.type}-${state.rows}-${state.columns}-${state.sdaPin}-${state.sclPin}`;
};
