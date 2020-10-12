import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { IRRemoteSensor, IRRemoteState } from "./state";

export const irRemoteSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const irRemoteSensorDatum = JSON.parse(block.metaData) as IRRemoteSensor[];

  const irRemoteData = irRemoteSensorDatum.find(
    (d) => d.loop == 1
  ) as IRRemoteSensor;
  const [analogPin] = block.pins;
  const irRemoteState: IRRemoteState = {
    hasCode: irRemoteData.scanned_new_code,
    code: irRemoteData.code,
    type: ArduinoComponentType.IR_REMOTE,
    pins: block.pins,
    analogPin,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      irRemoteState,
      "Setting up ir remote.",
      previousState
    ),
  ];
};
