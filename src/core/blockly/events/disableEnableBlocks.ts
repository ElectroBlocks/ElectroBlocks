import { getAllBlocks } from '../helpers/block.helper';
import { blocksRequireSetup } from '../helpers/disable/blocksRequireSetup.helper';
import { blockRequireToBeInSetupLoopOrFunction } from '../helpers/disable/blockRequireToBeInSetupLoopOrFunction.helper';
import { duplicatePinBlocks } from '../helpers/disable/duplicatePins.helper';
import { duplicateSetupBlocks } from '../helpers/disable/duplicateSetupBlocks.helper';
import { sensorReadBlocksHasRightPinSelected } from '../helpers/disable/sensorReadBlocksHasRightPinSelected.helper';
import { setupBlocksOutOfPins } from '../helpers/disable/setupBlocksOutOfPins.helper';

import _ from 'lodash';

export const disableEnableBlocks = () => {
  const blocks = getAllBlocks();
  // checkRightPinSelected(['is_button_pressed'], 'button_setup');
  // checkRightPinSelected(['digital_read'], 'digital_read_setup');
  // checkRightPinSelected(['analog_read'], 'analog_read_setup');
  const blocksDisableMessage = blocksIdsToDisableWithMessage();
  const blockIdsToDisable = _.keys(blocksDisableMessage);
  blocks
    .filter((block) => blockIdsToDisable.includes(block.id))
    .forEach((block) => {
      block.setEnabled(false);
      block.setWarningText(blocksDisableMessage[block.id]);
    });

  blocks
    .filter((block) => !blockIdsToDisable.includes(block.id))
    .forEach((block) => {
      block.setEnabled(true);
      block.setWarningText(null);
    });
};

const blocksIdsToDisableWithMessage = (): { [key: string]: null | string } => {
  const disableBlocks = [
    ...blocksRequireSetup(),
    ...blockRequireToBeInSetupLoopOrFunction(),
    ...duplicatePinBlocks(),
    ...duplicateSetupBlocks(),
    ...sensorReadBlocksHasRightPinSelected(
      ['analog_read'],
      'analog_read_setup'
    ),
    ...sensorReadBlocksHasRightPinSelected(
      ['digital_read'],
      'digital_read_setup'
    ),
    ...sensorReadBlocksHasRightPinSelected(
      ['is_button_pressed'],
      'button_setup'
    ),
    ...setupBlocksOutOfPins()
  ];
  return disableBlocks.reduce((prev, curr) => {
    if (!_.isEmpty(prev[curr.blockId]) && !_.isEmpty(prev[curr.blockId])) {
      prev[curr.blockId] =
        prev[curr.blockId].replace('.', '') + ', and ' + curr.warningText + '.';
      return prev;
    }

    if (_.isEmpty(prev[curr.blockId])) {
      prev[curr.blockId] = curr.warningText.replace('.', '') + '.';
      return prev;
    }

    return prev;
  }, {});
};
