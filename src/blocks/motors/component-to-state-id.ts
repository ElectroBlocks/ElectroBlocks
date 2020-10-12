import type { MotorState } from "./state";

export const getMotorStateId = (motorState: MotorState) => {
  return `${motorState.type}-${motorState.motorNumber}`;
};
