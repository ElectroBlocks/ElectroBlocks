import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { FastLEDState } from "./state";
import _ from "lodash";

export const fastLEDSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const numberOfLeds = +findFieldValue(block, "NUMBER_LEDS");

  const ledStripState: FastLEDState = {
    pins: block.pins,
    type: ArduinoComponentType.FASTLED_STRIP,
    numberOfLeds,
    fastLEDs: _.range(0, numberOfLeds).map((i) => {
      return {
        position: i,
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
      };
    }),
  };
  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledStripState,
      "Setting up led light strip.",
      previousState
    ),
  ];
};

export const setFastLEDColor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const fastLED = findComponent<FastLEDState>(
    previousState,
    ArduinoComponentType.FASTLED_STRIP
  );
  const color = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "COLOR",
    { red: 0, green: 0, blue: 0 },
    previousState
  );
  const position = getDefaultIndexValue(
    1,
    Infinity,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "POSITION",
      1,
      previousState
    )
  );
  fastLED.fastLEDs[position - 1] = { position: position - 1, color };
  const newComponent = _.cloneDeep(fastLED);

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Setting LED ${position} on light strip to color (red=${color.red},green=${color.green},blue=${color.blue})`,
      previousState
    ),
  ];
};