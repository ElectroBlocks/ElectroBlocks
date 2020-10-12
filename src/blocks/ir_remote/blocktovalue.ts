import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { IRRemoteState } from "./state";

export const irRemoteHasCode: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<IRRemoteState>(
    previousState,
    ArduinoComponentType.IR_REMOTE
  ).hasCode;
};

export const irRemoteGetCode: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<IRRemoteState>(
    previousState,
    ArduinoComponentType.IR_REMOTE
  ).code;
};
