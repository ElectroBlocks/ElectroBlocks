import _ from "lodash";
import { ArduinoComponentType } from "../../../core/frames/arduino.frame";
import { ButtonState } from "../../../core/frames/arduino-components.state";
import { ValueGenerator } from "../../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../../core/frames/transformer/frame-transformer.helpers";
import { findFieldValue } from "../../../core/blockly/helpers/block-data.helper";

export const isButtonPressed: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ButtonState>(
    previousState,
    ArduinoComponentType.BUTTON,
    findFieldValue(block, "PIN")
  ).isPressed;
};
