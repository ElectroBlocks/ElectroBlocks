import 'jest';
import '../../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue
} from '../../../../../tests/tests.helper';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { BlockEvent } from '../../../../blockly/state/event.data';
import {
  getAllBlocks,
  connectToArduinoBlock
} from '../../../../blockly/helpers/block.helper';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import _ from 'lodash';

describe('text_join state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('should be able to get the text length of text, variable and no block', () => {
    const textLengthBlock = workspace.newBlock('text_length');
    const textBlock = workspace.newBlock('text');
    textBlock.setFieldValue('blue', 'TEXT');
    textLengthBlock
      .getInput('VALUE')
      .connection.connect(textBlock.outputConnection);
    const numVariable = workspace.createVariable('num_test', 'Number');
    const numVariableBlock = workspace.newBlock(
      'variables_set_number'
    ) as BlockSvg;
    numVariableBlock.setFieldValue(numVariable.getId(), 'VAR');
    numVariableBlock
      .getInput('VALUE')
      .connection.connect(textLengthBlock.outputConnection);

    connectToArduinoBlock(numVariableBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: numVariableBlock.id
    };
    const [state1] = eventToFrameFactory(event);

    expect(state1.explanation).toBe('Variable "num_test" stores 4.');
    expect(state1.variables['num_test'].value).toBe(4);

    textBlock.dispose(true);

    const eventTest2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: numVariableBlock.id
    };
    const [stateTest1] = eventToFrameFactory(eventTest2);

    expect(stateTest1.explanation).toBe('Variable "num_test" stores 0.');
    expect(stateTest1.variables['num_test'].value).toBe(0);

    const stringVariableBlock = createSetVariableBlockWithValue(
      workspace,
      'test_string',
      VariableTypes.STRING,
      'Hello World!'
    );

    connectToArduinoBlock(stringVariableBlock);
    const getStringVariableBlock = workspace.newBlock('variables_get_string');
    getStringVariableBlock.setFieldValue(
      stringVariableBlock.getFieldValue('VAR'),
      'VAR'
    );
    textLengthBlock
      .getInput('VALUE')
      .connection.connect(getStringVariableBlock.outputConnection);

    const eventTest3: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: numVariableBlock.id
    };
    const [state1Test3, state2Test3] = eventToFrameFactory(eventTest3);

    expect(state2Test3.explanation).toBe('Variable "num_test" stores 12.');
    expect(state2Test3.variables['num_test'].value).toBe(12);
  });
});
