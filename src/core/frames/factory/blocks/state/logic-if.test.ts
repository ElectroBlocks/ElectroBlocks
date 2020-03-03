import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  createArduinoAndWorkSpace,
  createValueBlock
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import {
  getAllBlocks,
  connectToArduinoBlock
} from '../../../../blockly/helpers/block.helper';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ifBlockElse } from './logic';

describe('factories if block tests', () => {
  let workspace: Workspace;
  let arduinoBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
  });

  test('if blocks should execute if true is connnected true is connected to it other should not do anything', () => {
    const booleanBlock = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      true
    );
    const debugBlock1 = workspace.newBlock('debug_block');
    const debugBlock2 = workspace.newBlock('debug_block');
    const ifBlock = workspace.newBlock('control_if') as BlockSvg;
    ifBlock.getInput('IF0').connection.connect(booleanBlock.outputConnection);
    ifBlock.getInput('DO0').connection.connect(debugBlock1.previousConnection);
    debugBlock1.nextConnection.connect(debugBlock2.previousConnection);
    connectToArduinoBlock(ifBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ifBlock.id
    };

    const [state1, state2, state3] = eventToFrameFactory(event);
    expect(state1.explanation).toBe(
      'Executing blocks inside "DO" because what is connected is true.'
    );
    expect(state2).toBeDefined();
    expect(state3).toBeDefined();

    ['FALSE', 'delete'].forEach(action => {
      if (action === 'delete') {
        booleanBlock.dispose(true);
      } else {
        booleanBlock.setFieldValue(action, 'BOOL');
      }

      const event: BlockEvent = {
        blocks: getAllBlocks().map(transformBlock),
        variables: getAllVariables().map(transformVariable),
        type: Blockly.Events.BLOCK_MOVE,
        blockId: ifBlock.id
      };

      const states = eventToFrameFactory(event);
      expect(states.length).toBe(1);
      const [state1] = states;
      expect(state1.explanation).toBe(
        'Not executing blocks inside "DO" because waht is connected is false.'
      );
    });
  });

  test('should be execute else block if what is in there is not true', () => {
    const booleanBlock = createValueBlock(
      workspace,
      VariableTypes.BOOLEAN,
      true
    );
    const debugBlock1 = workspace.newBlock('debug_block');
    const debugBlock2 = workspace.newBlock('debug_block');
    const ifBlock = workspace.newBlock('controls_ifelse') as BlockSvg;
    ifBlock.getInput('IF0').connection.connect(booleanBlock.outputConnection);
    ifBlock.getInput('ELSE').connection.connect(debugBlock1.previousConnection);
    debugBlock1.nextConnection.connect(debugBlock2.previousConnection);
    connectToArduinoBlock(ifBlock);
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ifBlock.id
    };

    const states = eventToFrameFactory(event);
    expect(states.length).toBe(1);
    expect(states[0].explanation).toBe(
      'Executing blocks inside "DO" because what is connected is true.'
    );

    ['FALSE', 'delete'].forEach(action => {
      if (action === 'delete') {
        booleanBlock.dispose(true);
      } else {
        booleanBlock.setFieldValue(action, 'BOOL');
      }

      const event: BlockEvent = {
        blocks: getAllBlocks().map(transformBlock),
        variables: getAllVariables().map(transformVariable),
        type: Blockly.Events.BLOCK_MOVE,
        blockId: ifBlock.id
      };

      const states = eventToFrameFactory(event);
      expect(states.length).toBe(3);
      const [state1] = states;
      expect(state1.explanation).toBe(
        'Executing blocks inside "ELSE" because what is connected is false.'
      );
    });
  });
});
