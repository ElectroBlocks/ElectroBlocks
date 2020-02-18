import { BlockEvent } from '../../../state/event.data';
import { DisableBlock, ActionType } from '../../actions';
import _ from 'lodash';
import {
  PinCategory,
  BlockData,
  BlockTypeRequireRootBlock,
  BlockType
} from '../../../state/block.data';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { findRootBlock } from '../../../helpers/block-data.helper';

export const disableDuplicatePinBlocks = (
  event: BlockEvent
): DisableBlock[] => {
  const { blocks } = event;

  const pinCategories = getPinCategories(blocks);
  const categoriesWithDuplicatePins = _.keys(pinCategories)
    .map((cat) => getDuplicatePinsForCategory(pinCategories, cat as PinCategory))
    .filter((obj) => !_.isEmpty(obj.pins));

  const categoriesNamesThatHaveDuplicatePins = categoriesWithDuplicatePins.map(
    (dupPin) => dupPin.category
  );

  return blocks
      // Is the block in a duplicate pin category
    .filter((block) => categoriesNamesThatHaveDuplicatePins.includes(block.pinCategory))
    // Does the block duplicate pins for that pin category
    .filter(
      (block) =>
        _.intersection(
          categoriesWithDuplicatePins.find(
            (c) => c.category === block.pinCategory
          ).pins,
          block.pins
        ).length > 0
    )
    .map((block) => {
      const duplicatePins = categoriesWithDuplicatePins.find(
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
};

const getPinCategories = (blocks: BlockData[]) => {
  return blocks.reduce((prev, next) => {
    // If the blockd does not have any pins we can skip it
    if (_.isEmpty(next.pins)) {
      return prev;
    }

    // This is for block like is_button_pressed
    // They have a pin category of none so that they don't get counted
    if (next.pinCategory === PinCategory.NONE) {
      return prev;
    }

    // If the led or servo block is not connected to a function
    // it should not count as a pin being taken becauase that block will
    // be disabled and ran
    const rootBlock = findRootBlock(next, blocks);
    const isRootBlockFunction =
      rootBlock && [BlockType.ARDUINO, BlockType.FUNCTION].includes(rootBlock.type);
    if (BlockTypeRequireRootBlock.includes(next.type) && !isRootBlockFunction) {
      return prev;
    }

    if (prev[next.pinCategory]) {
      return {
        ...prev,
        [next.pinCategory]: _.union(next.pins, prev[next.pinCategory])
      };
    }

    return { ...prev, [next.pinCategory]: next.pins };
  }, {});
};

const getDuplicatePinsForCategory = (
  pinCategories: { [cat: string]: ARDUINO_UNO_PINS[] },
  category: PinCategory
): { category: string; pins: ARDUINO_UNO_PINS[] } => {
  return _.keys(pinCategories)
    .filter((cat) => category !== cat)
    .reduce(
      (prev, next) => {
        const duplicatePins = _.intersection(
          pinCategories[category],
          pinCategories[next]
        );
        if (_.isEmpty(duplicatePins)) {
          return prev;
        }
        return {
          category: next,
          pins: duplicatePins as ARDUINO_UNO_PINS[]
        };
      },
      { category: category, pins: [] }
    );
};
