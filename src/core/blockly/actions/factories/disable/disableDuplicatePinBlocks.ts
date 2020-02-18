import { BlockEvent } from '../../../state/event.data';
import { DisableBlock, ActionType } from '../../actions';
import _ from 'lodash';
import { PinCategory } from '../../../state/block.data';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';

export const disableDuplicatePinBlocks = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;

  const pinInCategory = blocks.reduce((prev, next) => {
    if (prev[next.pinCategory]) {
      return {
        ...prev,
        [next.pinCategory]: _.union(next.pins, prev[next.pinCategory])
      };
    }

    return { ...prev, [next.pinCategory]: next.pins };
  }, {});

  const duplicateWithCategoriesPins = _.keys(pinInCategory)
    .map((cat) => duplicatePinsForCategory(pinInCategory, cat as PinCategory))
    .filter((obj) => !_.isEmpty(obj));

  const duplicateCategories = duplicateWithCategoriesPins
    .filter((d) => !_.isEmpty(d.pins))
    .map((dupPin) => dupPin.category);

  return blocks
    .filter((block) => duplicateCategories.includes(block.pinCategory))
    .filter(
      (block) =>
        _.intersection(
          duplicateWithCategoriesPins.find(
            (c) => c.category === block.pinCategory
          ).pins,
          block.pins
        ).length > 0
    )
    .map((block) => {
      const duplicatePins = duplicateWithCategoriesPins.find(
        (d) => d.category === block.pinCategory
      ).pins;
      return {
        blockId: block.id,
        warningText: `This blocks has these duplicate pins: ${_.intersection(
          block.pins,
          duplicatePins
        ).join(', ')}`,
        type: ActionType.DISABLE_BLOCK
      };
    });

  return [];
};

const duplicatePinsForCategory = (
  pinInCategory: { [cat: string]: ARDUINO_UNO_PINS[] },
  categoryToCheck: PinCategory
): { category: string; pins: ARDUINO_UNO_PINS[] } => {
  return _.keys(pinInCategory)
    .filter((cat) => categoryToCheck !== cat)
    .reduce(
      (prev, next) => {
        const potentialDuplicatePin = _.intersection(
          pinInCategory[categoryToCheck],
          pinInCategory[next]
        );
        if (_.isEmpty(potentialDuplicatePin)) {
          return prev;
        }
        return {
          category: next,
          pins: potentialDuplicatePin as ARDUINO_UNO_PINS[]
        };
      },
      { category: categoryToCheck, pins: [] }
    );
};
