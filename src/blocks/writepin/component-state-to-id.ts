import { WritePinState } from "./state";

export const writePinId = (state: WritePinState) => {
  return `${state.type}-${state.pin}-${state.pinType}`;
};
