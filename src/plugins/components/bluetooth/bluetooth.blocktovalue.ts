import { ArduinoComponentType } from "../../../core/frames/arduino.frame";
import { ValueGenerator } from "../../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../../core/frames/transformer/frame-transformer.helpers";
import { BluetoothState } from "./bluetooth.state";

export const getBtMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<BluetoothState>(
    previousState,
    ArduinoComponentType.BLUE_TOOTH
  ).message;
};

export const hasBtMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<BluetoothState>(
    previousState,
    ArduinoComponentType.BLUE_TOOTH
  ).hasMessage;
};
