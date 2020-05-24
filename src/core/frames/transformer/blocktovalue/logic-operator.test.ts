import 'jest';
import '../../../blockly/blocks';

import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createValueBlock,
} from '../../../../tests/tests.helper';
import { VariableTypes } from '../../../blockly/dto/variable.data';
import { Color } from '../../arduino.frame';
import {
  connectToArduinoBlock,
  getAllBlocks,
} from '../../../blockly/helpers/block.helper';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { BlockEvent } from '../../../blockly/dto/event.data';

describe('logic operators blocks', () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  test('should be able to determine if something is true or false, logic_compare', () => {
    const boolTest = createSetVariableBlockWithValue(
      workspace,
      'bool_test',
      VariableTypes.BOOLEAN,
      true
    );
    boolTest.getInput('VALUE').connection.targetBlock().dispose(true);

    connectToArduinoBlock(boolTest);
    [
      {
        A: true,
        B: true,
        OP: 'OR',
        expectValue: true,
      },
      {
        A: true,
        B: false,
        OP: 'OR',
        expectValue: true,
      },
      {
        A: false,
        B: false,
        OP: 'OR',
        expectValue: false,
      },
      {
        A: true,
        B: true,
        OP: 'AND',
        expectValue: true,
      },
      {
        A: true,
        B: false,
        OP: 'AND',
        expectValue: false,
      },
    ].forEach(({ A, B, OP, expectValue }) => {
      const testBlock = createLogicCompareBlock(workspace, A, B, OP);
      boolTest.getInput('VALUE').connection.connect(testBlock.outputConnection);
      const event: BlockEvent = {
        blocks: getAllBlocks().map(transformBlock),
        variables: getAllVariables().map(transformVariable),
        type: Blockly.Events.BLOCK_MOVE,
        blockId: testBlock.id,
      };
      const events = eventToFrameFactory(event);
      const [state1] = events;
      expect(state1.variables['bool_test'].value).toBe(expectValue);
    });

    // If any value are blank it should return false o
    const logicOperatorBlock = workspace.newBlock(
      'logic_operation'
    ) as BlockSvg;
    boolTest
      .getInput('VALUE')
      .connection.connect(logicOperatorBlock.outputConnection);
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: logicOperatorBlock.id,
    };
    const events = eventToFrameFactory(event);
    const [state1] = events;
    expect(state1.variables['bool_test'].value).toBe(false);
  });

  const createLogicCompareBlock = (
    workspace: Workspace,
    value1: boolean,
    value2: boolean,
    operator: string
  ) => {
    const value1Block = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      value1
    );
    const value2Block = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      value2
    );
    const logicOperatorBlock = workspace.newBlock(
      'logic_operation'
    ) as BlockSvg;
    logicOperatorBlock.setFieldValue(operator, 'OP');
    logicOperatorBlock
      .getInput('A')
      .connection.connect(value1Block.outputConnection);
    logicOperatorBlock
      .getInput('B')
      .connection.connect(value2Block.outputConnection);

    return logicOperatorBlock;
  };
});
