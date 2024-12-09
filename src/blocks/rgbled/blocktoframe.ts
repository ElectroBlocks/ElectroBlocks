import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { hexToRgb } from "../../core/blockly/helpers/color.helper";
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

  const ledColorState1: LedColorState = {
    type: ArduinoComponentType.LED_COLOR,
    pins: [redPin, greenPin, bluePin],
    redPin,
    greenPin,
    bluePin,
    color: { green: 0, red: 0, blue: 0 },
    ledNumber: 1,
  };

  const setupFrame = arduinoFrameByComponent(
    block.id,
    block.blockName,
    timeline,
    ledColorState1,
    "Setting up color RGB Led.",
    previousState
  );

  if (numberOfComponents == 2) {
    const ledColorState2: LedColorState = {
      type: ArduinoComponentType.LED_COLOR,
      pins: [redPin2, greenPin2, bluePin2],
      redPin: redPin2,
      greenPin: greenPin2,
      bluePin: bluePin2,
      color: { green: 0, red: 0, blue: 0 },
      ledNumber: 2,
    };
    setupFrame.explanation = "Setting up color RGB Led 1 and 2.";
    setupFrame.components.push(ledColorState2);
  }
  return [setupFrame];
};

export const setLedColor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const color =
    block.blockName == "set_color_led"
      ? getInputValue(
          blocks,
          block,
          variables,
          timeline,
          "COLOR",
          { red: 0, green: 0, blue: 0 },
          previousState
        )
      : hexToRgb(findFieldValue(block, "COLOR"));
  let whichComponent = findFieldValue(block, "WHICH_COMPONENT");
  if (whichComponent == undefined) {
    whichComponent = 1;
  } else {
    whichComponent = +whichComponent;
  }

  const ledColorStates = previousState.components.filter(
    (x) => x.type == ArduinoComponentType.LED_COLOR
  );
  let ledState = ledColorStates.find(
    (x: LedColorState) => x.ledNumber == whichComponent
  );

  const newComponent = { ...ledState, color };

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
