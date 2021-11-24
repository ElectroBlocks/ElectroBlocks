import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type {
  ArduinoReceiveMessageState,
  ArduinoRecieveMessageSensor,
} from "./state";
import _ from "lodash";

export const messageSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  // TODO FIX WITH MESSAGE
  const messageDatum = JSON.parse(
    block.metaData
  ) as ArduinoRecieveMessageSensor[];
  const messbtnData = messageDatum.find((d) => d.loop == 1);

  const messageComponent: ArduinoReceiveMessageState = {
    pins: block.pins,
    hasMessage: messbtnData.receiving_message,
    message: messbtnData.message,
    type: ArduinoComponentType.MESSAGE,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      messageComponent,
      "Setting up Arduino messages.",
      previousState
    ),
  ];
};

export const arduinoSendMessage: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const message = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "MESSAGE",
    "",
    previousState
  );

  const components = previousState ? _.cloneDeep(previousState.components) : [];

  const replaceVariables = previousState ? { ...previousState.variables } : {};

  return [
    {
      blockId: block.id,
      blockName: block.blockName,
      sendMessage: message,
      timeLine: { ...timeline },
      variables: replaceVariables,
      txLedOn: true,
      builtInLedOn: false,
      components,
      explanation: `Arduino sending message: "${message}".`,
      delay: 0,
      powerLedOn: true,
      frameNumber: previousState ? previousState.frameNumber + 1 : 1,
    },
  ];
};
