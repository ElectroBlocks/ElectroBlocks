import { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type {
  BlockToDefaultComponnet,
  BlockToFrameTransformer,
} from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { LedState } from "./state";

export const ledDefault: BlockToDefaultComponnet = (block) => {
  const pin = findFieldValue(block, "PIN");
  const color = findFieldValue(block, "COLOR");

  const ledState: LedState = {
    type: ArduinoComponentType.LED,
    pins: [pin],
    pin: pin,
    state: 0,
    fade: block.blockName == "led_fade",
    color: color,
    usbCommands: [],
    setupCommand: `register::dw::${pin}`,
  };
  return ledState;
};

export const led: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  const color = findFieldValue(block, "COLOR");
  const state = findFieldValue(block, "STATE") === "ON" ? 1 : 0;
  const ledState: LedState = {
    type: ArduinoComponentType.LED,
    pins: [pin],
    pin: pin,
    state,
    fade: false,
    color: color,
    usbCommands: [`write::dw::${pin}::${state}`],
    setupCommand: `register::dw::${pin}`,
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
  const color = findFieldValue(block, "COLOR");

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
    color: color,
    usbCommands: [`write::aw::${pin}::${state}`],
    setupCommand: `register::aw::${pin}`,
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
