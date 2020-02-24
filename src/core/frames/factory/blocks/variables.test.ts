import 'jest';
import '../../../blockly/blocks';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { VariableTypes } from '../../../blockly/state/variable.data';
import {
  connectToArduinoBlock,
  getAllBlocks
} from '../../../blockly/helpers/block.helper';
import { BlockEvent } from '../../../blockly/state/event.data';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import _ from 'lodash';
import { Variable } from '../../state/arduino.state';

describe('test variables factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('all the set variables blocks should work', () => {
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const setNumberBlock = createSetVariableBlockWithValue(
      'num_var',
      VariableTypes.NUMBER,
      '30'
    );
    connectToArduinoBlock(setNumberBlock);
    const setStringBlock = createSetVariableBlockWithValue(
      'string_var',
      VariableTypes.STRING,
      'test'
    );
    connectToArduinoBlock(setStringBlock);

    const setBooleanBlock = createSetVariableBlockWithValue(
      'bool_var',
      VariableTypes.BOOLEAN,
      'TRUE'
    );
    connectToArduinoBlock(setBooleanBlock);

    const setColorBlock = createSetVariableBlockWithValue(
      'color_var',
      VariableTypes.COLOUR,
      '#FF0000'
    );
    connectToArduinoBlock(setColorBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: setColorBlock.id
    };
    const states = eventToFrameFactory(event);
    expect(states.length).toEqual(4);

    const [state1, state2, state3, state4] = states;
    const actualExplanation = states.map((s) => s.explanation).sort();
    const expectedExplanations = [
      'Variable "num_var" stores 30.',
      'Variable "string_var" stores "test".',
      'Variable "bool_var" stores true.',
      'Variable "color_var" stores [red=255,green=0,blue=0].'
    ].sort();
    expect(actualExplanation).toEqual(expectedExplanations);
    expect(_.keys(state1.variables).length).toBe(1);
    expect(_.keys(state2.variables).length).toBe(2);
    expect(_.keys(state3.variables).length).toBe(3);
    expect(_.keys(state4.variables).length).toBe(4);

    verifyVariable('num_var', VariableTypes.NUMBER, 30, state4.variables);
    verifyVariable(
      'string_var',
      VariableTypes.STRING,
      'test',
      state4.variables
    );
    verifyVariable('bool_var', VariableTypes.BOOLEAN, true, state4.variables);
    verifyVariable(
      'color_var',
      VariableTypes.COLOUR,
      { red: 255, green: 0, blue: 0 },
      state4.variables
    );
  });

  const verifyVariable = (
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

  const createSetVariableBlockWithValue = (
    name: string,
    type: VariableTypes,
    value: string
  ) => {
    const variableModel = workspace.createVariable(name, type);
    const block = createSetVariableBlock(type, value);
    block.setFieldValue(variableModel.getId(), 'VAR');

    return block;
  };

  const createSetVariableBlock = (
    type: VariableTypes,
    value: any
  ): BlockSvg => {
    if (type === VariableTypes.NUMBER) {
      const block = workspace.newBlock('variables_set_number');
      const valueBlock = workspace.newBlock('math_number');
      valueBlock.setFieldValue(value, 'NUM');
      block.getInput('VALUE').connection.connect(valueBlock.outputConnection);
      return block as BlockSvg;
    }
    if (type === VariableTypes.BOOLEAN) {
      const block = workspace.newBlock('variables_set_boolean');
      const valueBlock = workspace.newBlock('logic_boolean');
      valueBlock.setFieldValue(value, 'BOOL');
      block.getInput('VALUE').connection.connect(valueBlock.outputConnection);

      return block as BlockSvg;
    }

    if (type === VariableTypes.STRING) {
      const block = workspace.newBlock('variables_set_string');
      const valueBlock = workspace.newBlock('text');
      valueBlock.setFieldValue(value, 'TEXT');
      block.getInput('VALUE').connection.connect(valueBlock.outputConnection);

      return block as BlockSvg;
    }

    if (type === VariableTypes.COLOUR) {
      const block = workspace.newBlock('variables_set_colour');
      const valueBlock = workspace.newBlock('colour_picker');
      valueBlock.setFieldValue(value, 'COLOUR');
      block.getInput('VALUE').connection.connect(valueBlock.outputConnection);

      return block as BlockSvg;
    }
  };
});
