import { BlockEvent } from '../../../state/event.data';
import { DisableBlock, ActionType } from '../../actions';
import _ from 'lodash';

export const disableSetupBlockWithMultiplePinOutsSamePins = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;

  return blocks
    .filter((b) => _.uniq(b.pins).length !== b.pins.length)
    .map((b) => {
      return {
        type: ActionType.DISABLE_BLOCK,
        warningText: 'Block using the same pin twice',
        blockId: b.id
      };
    });
};
