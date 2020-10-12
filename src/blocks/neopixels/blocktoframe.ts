import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { NeoPixelState } from "./state";
import _ from "lodash";

export const neoPixelSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const numberOfLeds = +findFieldValue(block, "NUMBER_LEDS");

  const ledStripState: NeoPixelState = {
    pins: block.pins,
    type: ArduinoComponentType.NEO_PIXEL_STRIP,
    numberOfLeds,
    neoPixels: _.range(0, numberOfLeds).map((i) => {
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

export const setNeoPixelColor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const neoPixel = findComponent<NeoPixelState>(
    previousState,
    ArduinoComponentType.NEO_PIXEL_STRIP
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
  neoPixel.neoPixels[position - 1] = { position: position - 1, color };
  const newComponent = _.cloneDeep(neoPixel);

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
