import { StateGenerator } from '../../state.factories';
import {
  arduinoStateByExplanation
} from '../../factory.helpers';

export const debugBlock: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  return [
    arduinoStateByExplanation(
      block.id,
      timeline,
      'Debug [will pause in Arduino Code.]',
      preivousState
    )
  ];
};
