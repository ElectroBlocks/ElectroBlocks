import 'jest';
import '../../../../blockly/blocks';

import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createValueBlock
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { Color } from '../../../state/arduino.state';
import {
  connectToArduinoBlock,
  getAllBlocks
} from '../../../../blockly/helpers/block.helper';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { BlockEvent } from '../../../../blockly/state/event.data';

describe('logic not blocks', () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test('logic not block should turn a true value to a false value and if nothing is connect will return a true value', () => {
    const boolTest = createSetVariableBlockWithValue(
      workspace,
      'bool_test',
      VariableTypes.BOOLEAN,
      true
    );

    const notBlock = workspace.newBlock('logic_negate');
    boolTest.getInput('VALUE').connection.connect(notBlock.outputConnection);
    connectToArduinoBlock(boolTest);
    // testing true turns to false
    const event1: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: boolTest.id
    };
    const [event1state1] = eventToFrameFactory(event1);
    expect(event1state1.variables['bool_test'].value).toBeFalsy();

    // Testing false turns to true
    boolTest
      .getInput('VALUE')
      .connection.targetBlock()
      .getInput('BOOL')
      .connection.targetBlock()
      .setFieldValue('FALSE', 'BOOL');

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: boolTest.id
    };
    const [event2state1] = eventToFrameFactory(event2);
    expect(event2state1.variables['bool_test'].value).toBeTruthy();

    // testing not block connected
    boolTest
      .getInput('VALUE')
      .connection.targetBlock()
      .getInput('BOOL')
      .connection.targetBlock()
      .dispose(true);
    const event3: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: boolTest.id
    };
    const [event3state1] = eventToFrameFactory(event3);
    expect(event3state1.variables['bool_test'].value).toBeTruthy();
  });
});
