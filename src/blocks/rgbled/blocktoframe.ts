import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { LedColorState } from "./state";

export const ledColorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const redPin = findFieldValue(block, "PIN_RED");
  const greenPin = findFieldValue(block, "PIN_GREEN");
  const bluePin = findFieldValue(block, "PIN_BLUE");
  const pictureType = findFieldValue(block, "PICTURE_TYPE");
  const ledColorState: LedColorState = {
    type: ArduinoComponentType.LED_COLOR,
    pins: block.pins.sort(),
    redPin,
    greenPin,
    bluePin,
    color: { green: 0, red: 0, blue: 0 },
    pictureType,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledColorState,
      "Setting up color led.",
      previousState
    ),
  ];
};

export const setLedColor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const color = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "COLOUR",
    { red: 0, green: 0, blue: 0 },
    previousState
  );

  const ledColor = findComponent<LedColorState>(
    previousState,
    ArduinoComponentType.LED_COLOR
  );
  const newComponent = { ...ledColor, color };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Setting led color to (red=${color.red},green=${color.green},blue=${color.blue}).`,
      previousState
    ),
  ];
};
