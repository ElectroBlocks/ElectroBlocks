import type { Color } from "../../frames/arduino.frame";

export enum VariableTypes {
  NUMBER = 'Number',
  STRING = 'String',
  BOOLEAN = 'Boolean',
  COLOUR = 'Colour',
  LIST_STRING = 'List String',
  LIST_NUMBER = 'List Number',
  LIST_BOOLEAN = 'List Boolean',
  LIST_COLOUR = 'List Colour',
}

export interface VariableData {
  id: string;
  name: string;
  type: VariableTypes;
  isBeingUsed: boolean;
  value?:
    | number
    | string
    | boolean
    | Color 
    | number[]
    | string[]
    | boolean[]
    | Color[];
}
