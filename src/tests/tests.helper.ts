import 'jest';
import { Workspace, BlockSvg, WorkspaceSvg } from 'blockly';
import * as helpers from '../core/blockly/helpers/workspace.helper';
import { VariableTypes } from '../core/blockly/state/variable.data';
import { Variable, Color } from '../core/frames/state/arduino.state';
import { setVariable } from '../core/frames/factory/blocks/state/set_variables';
import { hexToRgb, rgbToHex } from '../core/blockly/helpers/color.helper';

export const createArduinoAndWorkSpace = (): [WorkspaceSvg, BlockSvg] => {
  const workspace = new Workspace() as WorkspaceSvg;
  jest
    .spyOn(helpers, 'getWorkspace')
    .mockReturnValue(workspace as WorkspaceSvg);
  const arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;

  return [workspace, arduinoBlock];
};

export const verifyVariable = (
  variableName: string,
  type: VariableTypes,
  value: any,
  variables: { [key: string]: Variable }
) => {
  const variable = variables[variableName];
  expect(variable).toBeDefined();
  expect(variable.id).toBeDefined();
  expect(variable.value).toEqual(value);
  expect(variable.type).toBe(type);
};

export const createSetVariableBlockWithValue = (
  workspace: Workspace,
  name: string,
  type: VariableTypes,
  value: string | number | boolean | Color
) => {
  const variableModel = workspace.createVariable(name, type);
  if (type === VariableTypes.NUMBER) {
    const block = workspace.newBlock('variables_set_number');
    const valueBlock = workspace.newBlock('math_number');
    valueBlock.setFieldValue(value.toString(), 'NUM');
    block.getInput('VALUE').connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), 'VAR');
    return block as BlockSvg;
  }
  if (type === VariableTypes.BOOLEAN) {
    const block = workspace.newBlock('variables_set_boolean');
    const valueBlock = workspace.newBlock('logic_boolean');
    valueBlock.setFieldValue(value ? 'TRUE' : 'FALSE', 'BOOL');
    block.getInput('VALUE').connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), 'VAR');
    return block as BlockSvg;
  }

  if (type === VariableTypes.STRING) {
    const block = workspace.newBlock('variables_set_string');
    const valueBlock = workspace.newBlock('text');
    valueBlock.setFieldValue(value.toString(), 'TEXT');
    block.getInput('VALUE').connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), 'VAR');
    return block as BlockSvg;
  }

  if (type === VariableTypes.COLOUR) {
    const block = workspace.newBlock('variables_set_colour');
    const valueBlock = workspace.newBlock('colour_picker');
    valueBlock.setFieldValue(rgbToHex(value as Color), 'COLOUR');
    block.getInput('VALUE').connection.connect(valueBlock.outputConnection);
    block.setFieldValue(variableModel.getId(), 'VAR');
    return block as BlockSvg;
  }

  throw new Error('Unsupported Variable Type: ' + type);
};

export const createValueBlock = (
  workspace: Workspace,
  type: VariableTypes,
  value: string | number | boolean | Color
): BlockSvg => {
  if (type === VariableTypes.STRING) {
    const block = workspace.newBlock('text');
    block.setFieldValue(value.toString(), 'TEXT');

    return block as BlockSvg;
  }

  if (type === VariableTypes.BOOLEAN) {
    const block = workspace.newBlock('logic_boolean');
    block.setFieldValue(value ? 'TRUE' : 'FALSE', 'BOOL');

    return block as BlockSvg;
  }

  if (type === VariableTypes.NUMBER) {
    const block = workspace.newBlock('math_number');
    block.setFieldValue(value.toString(), 'NUM');

    return block as BlockSvg;
  }

  if (type === VariableTypes.COLOUR) {
    const block = workspace.newBlock('colour_picker');
    block.setFieldValue(rgbToHex(value as Color), 'COLOUR');

    return block as BlockSvg;
  }

  throw new Error('unsupported type');
};

export const createGetVariable = (setBlock: BlockSvg, workspace: Workspace) => {
  const getVariableType = setBlock.type.replace('set', 'get');
  const block = workspace.newBlock(getVariableType);
  block.setFieldValue(setBlock.getFieldValue('VAR'), 'VAR');

  return block;
};
