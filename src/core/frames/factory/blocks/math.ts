import { ValueGenerator } from '../value.factories';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

export const mathNumber: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return +findFieldValue(block, 'NUM');
};
