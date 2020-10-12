import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { AnalogSensorState } from "./state";

export const analogRead: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<AnalogSensorState>(
    previousState,
    ArduinoComponentType.ANALOG_SENSOR,
    findFieldValue(block, "PIN")
  ).state;
};
