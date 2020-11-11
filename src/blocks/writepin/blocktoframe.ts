import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { WritePinState, WritePinType } from "./state";

export const digitalWrite: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  const wordState = findFieldValue(block, "STATE") === "ON" ? "on" : "off";
  const state = findFieldValue(block, "STATE") === "ON" ? 1 : 0;
  const digitalWriteState: WritePinState = {
    type: ArduinoComponentType.WRITE_PIN,
    pins: [pin],
    pin: pin,
    state,
    pinType: WritePinType.DIGITAL_OUTPUT,
  };
  const explanation = `Turning pin ${pin} ${wordState}.`;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      digitalWriteState,
      explanation,
      previousState
    ),
  ];
};

export const analogWrite: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const pin = findFieldValue(block, "PIN");
  const state = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "WRITE_VALUE",
    1,
    previousState
  );
  const analogWriteState: WritePinState = {
    type: ArduinoComponentType.WRITE_PIN,
    pins: [pin],
    pin: pin,
    state,
    pinType: WritePinType.ANALOG_OUTPUT,
  };
  const explanation = `Sending ${state} to pin ${pin}.`;

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      analogWriteState,
      explanation,
      previousState
    ),
  ];
};
