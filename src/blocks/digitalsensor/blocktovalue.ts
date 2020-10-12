import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { DigitalSensorState } from "./state";

export const digitalRead: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<DigitalSensorState>(
    previousState,
    ArduinoComponentType.DIGITAL_SENSOR,
    findFieldValue(block, "PIN")
  ).isOn;
};
