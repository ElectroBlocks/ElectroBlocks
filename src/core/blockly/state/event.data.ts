import { BlockData } from './block.data';
import { VariableData } from './variable.data';

export interface BlockEvent {
  blocks: BlockData[],
  variables: VariableData[];
  type: string; // the type of event
  blockId: string;

  fieldName?: string; // the field name that got changed
  fieldType?: string;
  oldValue?: string; // previous value that got changes
  newValue?: string; // 

}