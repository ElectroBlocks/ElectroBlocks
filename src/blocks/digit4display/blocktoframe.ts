import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import {
  arduinoFrameByComponent,
  findComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import { DigitilDisplayState } from "./state";
import _ from "lodash";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";

export const digit4DisplaySetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const component: DigitilDisplayState = {
    type: ArduinoComponentType.DIGITAL_DISPLAY,
    pins: block.pins.sort(),
    dioPin: findFieldValue(block, "DIO_PIN"),
    clkPin: findFieldValue(block, "CLK_PIN"),
    chars: "",
    colonOn: false,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      component,
      "Setting up digital display.",
      previousState
    ),
  ];
};

export const digitalDisplaySet: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const component = _.cloneDeep(
    findComponent(
      previousState,
      ArduinoComponentType.DIGITAL_DISPLAY
    ) as DigitilDisplayState
  );
  component.colonOn = findFieldValue(block, "COLON") === "TRUE";
  const chars = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "TEXT",
    "",
    previousState
  );
  component.chars = chars.slice(0, 4);

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      component,
      `Setting Digital Display text to "${component.chars}" and colon is ${
        component.colonOn ? "on" : "off"
      }.`,
      previousState
    ),
  ];
};
