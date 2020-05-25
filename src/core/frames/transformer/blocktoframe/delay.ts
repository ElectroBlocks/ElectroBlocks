import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { getInputValue } from '../block-to-value.factories';
import _ from 'lodash';

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
    'DELAY',
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
      sendMessage: '',
      timeLine: { ...timeline },
      variables: newVariables,
      txLedOn: false,
      builtInLedOn: false,
      components: newComponets,
      explanation,
      delay,
      powerLedOn: true,
    },
  ];
};
