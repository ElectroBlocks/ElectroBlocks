import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { LedState } from "./state";

export const led: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  const state = findFieldValue(block, "STATE") === "ON" ? 1 : 0;
  const ledState: LedState = {
    type: ArduinoComponentType.LED,
    pins: [pin],
    pin: pin,
    state,
    fade: false,
  };
  const explanation = `Turning ${state === 1 ? "on" : "off"} led ${pin}.`;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledState,
      explanation,
      previousState
    ),
  ];
};

export const ledFade: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  const state = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "FADE",
    1,
    previousState
  );
  const ledState: LedState = {
    type: ArduinoComponentType.LED,
    pins: [pin],
    pin: pin,
    state,
    fade: true,
  };
  const explanation = `Fading Led ${pin} to ${state}.`;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledState,
      explanation,
      previousState
    ),
  ];
};
