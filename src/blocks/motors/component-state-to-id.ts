import type { MotorShieldState } from "./state";

export const getMotorShieldId = (state: MotorShieldState) => {
  return `${state.type}_${state.numberOfMotors}_${state.pins.join("_")}`;
};
