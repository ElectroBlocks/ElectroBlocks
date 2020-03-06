import { StateGenerator } from '../../state.factories';
import { getInputValue } from '../../value.factories';
import _ from 'lodash';
import {
  generateInputState,
  arduinoStateByExplanation
} from '../../factory.helpers';

export const simpleLoop: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const times = Math.abs(
    getInputValue(blocks, block, variables, timeline, 'TIMES', 1, previousState)
  );

  return _.range(1, times + 1).reduce((prev, next) => {
    const beforeState = _.isEmpty(prev) ? previousState : prev[prev.length - 1];

    const loopFrame = arduinoStateByExplanation(
      block.id,
      timeline,
      `Running loop ${next} out of ${times} times.`,
      beforeState
    );

    return [
      ...prev,
      loopFrame,
      ...generateInputState(block, blocks, variables, timeline, 'DO', loopFrame)
    ];
  }, []);
};
