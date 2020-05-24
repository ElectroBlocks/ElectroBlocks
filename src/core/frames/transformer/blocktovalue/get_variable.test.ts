import 'jest';
import '../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
} from '../../../../tests/tests.helper';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { VariableTypes } from '../../../blockly/dto/variable.data';
import { BlockEvent } from '../../../blockly/dto/event.data';
import {
  getAllBlocks,
  connectToArduinoBlock,
} from '../../../blockly/helpers/block.helper';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import _ from 'lodash';

describe('math_arithmetic state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('if the variable we are trying to get does not exist it should use default value', () => {
    const numberVariableBlock = createSetVariableBlockWithValue(
      workspace,
      'num',
      VariableTypes.NUMBER,
      33
    );

    const getVariableNumberBlock = workspace.newBlock('variables_get_number');
    getVariableNumberBlock.setFieldValue(
      numberVariableBlock.getFieldValue('VAR'),
      'VAR'
    );

    const variable = workspace.createVariable('var_test', 'Number');
    const testNumberVariableBlock = workspace.newBlock(
      'variables_set_number'
    ) as BlockSvg;
    testNumberVariableBlock.setFieldValue(variable.getId(), 'VAR');
    testNumberVariableBlock
      .getInput('VALUE')
      .connection.connect(getVariableNumberBlock.outputConnection);
    connectToArduinoBlock(numberVariableBlock);
    connectToArduinoBlock(testNumberVariableBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: testNumberVariableBlock.id,
    };
    const [state1, state2] = eventToFrameFactory(event);

    expect(state1.explanation).toBe('Variable "var_test" stores 1.');
    expect(state2.explanation).toBe('Variable "num" stores 33.');
    expect(_.keys(state1.variables).length).toBe(1);
    expect(_.keys(state2.variables).length).toBe(2);
    expect(state1.variables['var_test'].value).toBe(1);
    expect(state2.variables['num'].value).toBe(33);
  });
});
