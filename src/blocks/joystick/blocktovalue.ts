import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { JoystickState } from "./state";

export const joystickEngaged: ValueGenerator = (
  blocks,
  currentBlock,
  variables,
  timeline,
  previousState
) => {
  const component = findComponent<JoystickState>(
    previousState,
    ArduinoComponentType.JOYSTICK
  );

  return component.engaged;
};

export const joystickAngle: ValueGenerator = (
  blocks,
  currentBlock,
  variables,
  timeline,
  previousState
) => {
  const component = findComponent<JoystickState>(
    previousState,
    ArduinoComponentType.JOYSTICK
  );

  return component.degree;
};

export const joystickButton: ValueGenerator = (
  blocks,
  currentBlock,
  variables,
  timeline,
  previousState
) => {
  const component = findComponent<JoystickState>(
    previousState,
    ArduinoComponentType.JOYSTICK
  );

  return component.buttonPressed;
};
