import { BlockData } from "./block.type";
import { VariableData } from "./variable.type";
import { MicrocontrollerType } from "../../microcontroller/microcontroller";

export interface BlockEvent {
  blocks: BlockData[];
  variables: VariableData[];
  type: string; // the type of event
  blockId: string;
  microController: MicrocontrollerType;

  fieldName?: string; // the field name that got changed
  fieldType?: string;
  oldValue?: string; // previous value that got changes
  newValue?: string; //
}
