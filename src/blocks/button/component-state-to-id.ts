import type { ButtonState } from "./state";

export const getButtonId = (state: ButtonState) => {
  return `${state.type}-${state.pins[0]}`;
};
