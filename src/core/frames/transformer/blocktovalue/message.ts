import { ValueGenerator } from "../block-to-value.factories";
import { findComponent } from "../frame-transformer.helpers";
import { ArduinoReceiveMessageState } from "../../arduino-components.state";
import { ArduinoComponentType } from "../../arduino.frame";

export const getArduinoMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ArduinoReceiveMessageState>(
    previousState,
    ArduinoComponentType.MESSAGE
  ).message;
};

export const arduinoHasMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ArduinoReceiveMessageState>(
    previousState,
    ArduinoComponentType.MESSAGE
  ).hasMessage;
};
