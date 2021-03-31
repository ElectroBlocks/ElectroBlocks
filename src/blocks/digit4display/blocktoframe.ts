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
    pins: block.pins,
    dioPin: findFieldValue(block, "DIO_PIN"),
    clkPin: findFieldValue(block, "CLK_PIN"),
    chars: "",
    topDotOn: false,
    bottomDotOn: false,
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

export const digitalDisplayDots: BlockToFrameTransformer = (
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
  component.topDotOn = findFieldValue(block, "TOP_DOT") === "TRUE";
  component.bottomDotOn = findFieldValue(block, "BOTTOM_DOT") === "TRUE";

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      component,
      `Digital Display top dot ${
        component.topDotOn ? "on" : "off"
      } and bottom dot ${component.bottomDotOn ? "on" : "off"}.`,
      previousState
    ),
  ];
};

export const digitalDisplayText: BlockToFrameTransformer = (
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
      `Setting digital display text to "${component.chars}"`,
      previousState
    ),
  ];
};
