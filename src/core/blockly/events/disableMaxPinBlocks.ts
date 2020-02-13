import { getTopBlocks } from '../helpers/block.helper';
import { blockMultipleSetup } from './disableEnableBlocks';

export const disableMaxPinsBlocks = () => {
  getTopBlocks()
    .filter((block) => blockMultipleSetup.includes(block.type))
    .filter((block) => block.type !== 'procedures_defnoreturn')
    .forEach((block) => {
      if (block.isEnabled() && block.getFieldValue('PIN') !== 'MAX_PINS') {
        return;
      }

      if (!block.isEnabled() && block.getFieldValue('PIN') === 'MAX_PINS') {
        return;
      }

      console.log(block, 'disableMaxPinsBlocks');
      if (block.isEnabled()) {
        block.setEnabled(false);
        block.setWarningText(
          'The arduino uno does not have enough pins to support adding more blocks.'
        );
        return;
      }

      block.setWarningText(null);
      block.setEnabled(true);
    });
};
