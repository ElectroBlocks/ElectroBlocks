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
  const [pin] = block.pins;
  const irRemoteState: IRRemoteState = {
    hasCode: irRemoteData.scanned_new_code,
    code: irRemoteData.code,
    type: ArduinoComponentType.IR_REMOTE,
    pins: block.pins,
    pin: pin,
    setupCommand: `register::ir::${pin}`,
    importLibraries: [
      {
        name: "IRremote",
        url: "https://downloads.arduino.cc/libraries/github.com/z3t0/IRremote-4.2.1.zip",
        version: "latest",
      },
    ],
    enableFlag: "ENABLE_IR_REMOTE",
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
