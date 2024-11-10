import _ from "lodash";
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
  const redPin = findFieldValue(block, "PIN_RED_1");
  const greenPin = findFieldValue(block, "PIN_GREEN_1");
  const bluePin = findFieldValue(block, "PIN_BLUE_1");
  const redPin2 = findFieldValue(block, "PIN_RED_2");
  const greenPin2 = findFieldValue(block, "PIN_GREEN_2");
  const bluePin2 = findFieldValue(block, "PIN_BLUE_2");
  const numberOfComponents = +findFieldValue(block, "NUMBER_OF_COMPONENTS");
  const pins =
    numberOfComponents == 2
      ? [redPin, greenPin, bluePin, redPin2, greenPin2, bluePin2]
      : [redPin, greenPin, bluePin];
  const ledColorState: LedColorState = {
    type: ArduinoComponentType.LED_COLOR,
    pins: pins.sort(),
    redPin1: redPin,
    greenPin1: greenPin,
    bluePin1: bluePin,
    redPin2: redPin2,
    greenPin2: greenPin2,
    bluePin2: bluePin2,
    numberOfComponents,
    color: { green: 0, red: 0, blue: 0 },
    color2: { green: 0, red: 0, blue: 0 },
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
    "COLOR",
    { red: 0, green: 0, blue: 0 },
    previousState
  );

  const ledColor = findComponent<LedColorState>(
    previousState,
    ArduinoComponentType.LED_COLOR
  );
  const whichLed =
    ledColor.numberOfComponents == 1
      ? 1
      : +findFieldValue(block, "WHICH_COMPONENT");

  const newComponent = _.cloneDeep(ledColor);
  if (whichLed == 1) {
    newComponent.color = color;
  } else {
    newComponent.color2 = color;
  }

  const message =
    newComponent.numberOfComponents == 1
      ? `Setting led color to (red=${color.red},green=${color.green},blue=${color.blue}).`
      : `Setting led ${whichLed} color to (red=${color.red},green=${color.green},blue=${color.blue}).`;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      message,
      previousState
    ),
  ];
};
