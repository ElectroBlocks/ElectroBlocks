import _ from "lodash";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";

export const delayBlock: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const seconds = +getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "DELAY",
    1,
    previousState
  );

  const delay = seconds * 1000;

  const explanation = `Waiting for ${seconds.toFixed(2)} seconds.`;

  const newVariables = previousState
    ? { ..._.cloneDeep(previousState.variables) }
    : {};
  const newComponets = previousState
    ? [..._.cloneDeep(previousState.components)]
    : [];

  return [
    {
      blockId: block.id,
      blockName: block.blockName,
      sendMessage: "",
      timeLine: { ...timeline },
      variables: newVariables,
      txLedOn: false,
      builtInLedOn: false,
      components: newComponets,
      explanation,
      delay,
      powerLedOn: true,
      frameNumber: previousState ? previousState.frameNumber + 1 : 1,
    },
  ];
};
