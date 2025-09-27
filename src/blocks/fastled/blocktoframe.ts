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
import { hexToRgb, rgbToHex } from "../../core/blockly/helpers/color.helper";

const colorOrderToNumber = (colorOrder) => {
  const orderTONumber = {
    RGB: 128,
    GRB: 129,
    RBG: 130,
    GBR: 131,
    BRG: 132,
    BGR: 133,
  };

  return orderTONumber[colorOrder];
};

export const fastLEDSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const numberOfLeds = +findFieldValue(block, "NUMBER_LEDS");
  const colorOrder = findFieldValue(block, "COLOR_ORDER");
  const brightness = +findFieldValue(block, "BRIGHTNESS");
  const colorNum = colorOrderToNumber(colorOrder);
  const ledStripState: FastLEDState = {
    pins: block.pins,
    type: ArduinoComponentType.FASTLED_STRIP,
    numberOfLeds,
    setupCommand: `register::leds::${block.pins[0]}::${numberOfLeds}::${colorNum}::${brightness}`,
    preShowLEDs: _.range(0, numberOfLeds).map((i) => {
      return {
        position: i,
        color: {
          red: 0,
          green: 0,
          blue: 0,
        },
      };
    }),
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

export const showAllColors: BlockToFrameTransformer = (
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
  const preShowLeds = _.range(0, fastLED.numberOfLeds).map((i) => {
    return {
      position: i,
      color: {
        red: 0,
        green: 0,
        blue: 0,
      },
    };
  });
  const newFastLeds = fastLED.preShowLEDs;
  fastLED.fastLEDs = _.cloneDeep(newFastLeds);
  const newComponent = _.cloneDeep(fastLED);
  newComponent.usbCommands = [`write::leds::${fastLED.pins[0]}::1`];

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Displaying all the rgb leds on the light strip.`,
      previousState
    ),
  ];
};

export const setAllColors: BlockToFrameTransformer = (
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

  const leds = [];
  for (let position = 1; position <= fastLED.numberOfLeds; position += 1) {
    const hexValue = findFieldValue(block, getRowColId(position));
    const color = hexToRgb(hexValue);
    leds.push({ position: position - 1, color });
  }
  fastLED.preShowLEDs = leds;
  const newComponent = _.cloneDeep(fastLED);
  let usbCommands = [];
  const usbCommandBase = `write::leds::${fastLED.pins[0]}::2`;
  for (let position in newComponent.fastLEDs) {
    let hex = rgbToHex(newComponent.fastLEDs[position].color);
    hex = hex.replace("#", "");
    usbCommands.push(usbCommandBase + `::${position}::${hex}`);
  }
  newComponent.usbCommands = usbCommands;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Setting all the colors in the rgb led strip.`,
      previousState
    ),
  ];
};

const getRowColId = (position: number): string => {
  const row = Math.ceil(position / 12);

  return `${row}-${position - (row - 1) * 12}`;
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
  fastLED.preShowLEDs[position - 1] = { position: position - 1, color };
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
