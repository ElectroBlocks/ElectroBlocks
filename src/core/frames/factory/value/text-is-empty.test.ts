import 'jest';
import '../../../blockly/blocks';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
} from '../../../../tests/tests.helper';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { VariableTypes } from '../../../blockly/state/variable.data';
import { BlockEvent } from '../../../blockly/state/event.data';
import {
  getAllBlocks,
  connectToArduinoBlock,
} from '../../../blockly/helpers/block.helper';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import _ from 'lodash';

describe('text_isEmpty state factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('should is empty should detect whether a text block/variable or nothing is empty', () => {
    const textIsEmpty = workspace.newBlock('text_isEmpty');
    const textBlock = workspace.newBlock('text');
    textBlock.setFieldValue('', 'TEXT');
    const setStringVariable = createSetVariableBlockWithValue(
      workspace,
      'random_text',
      VariableTypes.STRING,
      'blue'
    );
    const testBoolVariable = createSetVariableBlockWithValue(
      workspace,
      'test_bool',
      VariableTypes.BOOLEAN,
      false
    );
    testBoolVariable.getInput('VALUE').connection.targetBlock().dispose(true);

    testBoolVariable
      .getInput('VALUE')
      .connection.connect(textIsEmpty.outputConnection);

    // Test text block works

    textIsEmpty
      .getInput('VALUE')
      .connection.connect(textBlock.outputConnection);

    connectToArduinoBlock(testBoolVariable);

    const event1: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: testBoolVariable.id,
    };
    const [state1Event1] = eventToFrameFactory(event1);

    expect(state1Event1.explanation).toBe('Variable "test_bool" stores true.');
    expect(state1Event1.variables['test_bool'].value).toBeTruthy();

    textBlock.dispose(true);
    const getStringVariable = workspace.newBlock('variables_get_string');
    getStringVariable.setFieldValue(
      setStringVariable.getFieldValue('VAR'),
      'VAR'
    );
    textIsEmpty
      .getInput('VALUE')
      .connection.connect(getStringVariable.outputConnection);

    connectToArduinoBlock(setStringVariable);

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: testBoolVariable.id,
    };
    const [state1Event2, state2Event2] = eventToFrameFactory(event2);

    expect(state2Event2.explanation).toBe('Variable "test_bool" stores false.');
    expect(state2Event2.variables['test_bool'].value).toBeFalsy();

    getStringVariable.dispose(true);
    setStringVariable.dispose(true);

    const event3: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: testBoolVariable.id,
    };
    const [state2Event3] = eventToFrameFactory(event3);

    expect(state2Event3.explanation).toBe('Variable "test_bool" stores true.');
    expect(state2Event3.variables['test_bool'].value).toBeTruthy();
  });
});
