import { BlockSvg, VariableModel } from 'blockly';
import { transformBlock } from './block.transformer';
import { BlockEvent } from '../dto/event.data';
import _ from 'lodash';
import { transformVariable } from './variables.transformer';

export const transformEvent = (
  blocks: BlockSvg[],
  variables: VariableModel[],
  event: Object | any
): BlockEvent => {
  const blockDatum = blocks.map(transformBlock);
  return {
    blockId: _.get(event, 'blockId', undefined),
    type: event.type,
    blocks: blockDatum,
    variables: variables.map(transformVariable),
    fieldName: _.get(event, 'name', undefined),
    fieldType: _.get(event, 'element', undefined),
    newValue: _.get(event, 'newValue', undefined),
    oldValue: _.get(event, 'oldValue', undefined),
  };
};
