import type { AnalogSensorState } from "./state";

export const getAnalogSensorId = (state: AnalogSensorState) => {
  return `${state.type}-${state.pictureType}-${state.pin}`;
};
