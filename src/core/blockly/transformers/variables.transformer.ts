import {
  isVariableBeingUsed,
} from '../helpers/variable.helper';
import type { VariableModel } from 'blockly';
import type { VariableData, VariableTypes } from '../dto/variable.type';

export const transformVariable = (variable: VariableModel): VariableData => {
  return {
    isBeingUsed: isVariableBeingUsed(variable.getId()),
    name: variable.name,
    id: variable.getId(),
    type: variable.type as VariableTypes,
  };
};
