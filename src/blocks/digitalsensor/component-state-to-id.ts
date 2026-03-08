import type { DigitalSensorState } from "./state";

export const getDigitalSensorId = (state: DigitalSensorState) => {
  return `${state.type}-${state.sensorType}-${state.pin}`;
};
