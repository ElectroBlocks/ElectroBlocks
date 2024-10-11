import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import _ from "lodash";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import {
  arduinoFrameByComponent,
  findComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { ButtonSensor, ButtonState } from "./state";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";

export const buttonSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const btnDatum = JSON.parse(block.metaData) as ButtonSensor[];
  const btnData = btnDatum.find((d) => d.loop === 1);

  const [pin] = block.pins;

  const buttonState: ButtonState = {
    type: ArduinoComponentType.BUTTON,
    pins: block.pins,
    isPressed: btnData.is_pressed,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      buttonState,
      `button ${pin} is being setup.`,
      previousState
    ),
  ];
};

export const releaseButton: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  let buttonState = findComponent<ButtonState>(
    previousState,
    ArduinoComponentType.BUTTON,
    pin
  );
  buttonState = _.clone(buttonState);
  buttonState.isPressed = false;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      buttonState,
      `Button ${pin} is being released.`,
      previousState
    ),
  ];
};