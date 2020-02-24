import { ValueGenerator } from '../value.factories';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { hexToRgb } from '../../../blockly/helpers/color.helper';

export const colorPicker: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const color = findFieldValue(block, 'COLOUR');

  return hexToRgb(color);
};
