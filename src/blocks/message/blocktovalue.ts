import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ArduinoReceiveMessageState } from "./state";

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
