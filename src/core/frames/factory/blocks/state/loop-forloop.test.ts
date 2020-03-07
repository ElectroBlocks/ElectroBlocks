import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  createArduinoAndWorkSpace,
  createValueBlock
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import {
  connectToArduinoBlock,
  getAllBlocks
} from '../../../../blockly/helpers/block.helper';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { debugBlock } from './debug';

describe('generate states controls_for block', () => {
  let workspace: Workspace;
  let arduinoBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
  });

  test('should loop -3 to -10 subtracting by 2', () => {
    // -3 -5, -7, -9
    const info = generateFrameForLoop(workspace, -3, -10, 2);
    const [
      state1,
      state2,
      state3,
      state4,
      state5,
      state6,
      state7,
      state8
    ] = info.frames;

    expect(state1.explanation).toBe('Running loop 1 out 4 times; i = -3');
    expect(state1.variables['i'].value).toBe(-3);
    expect(state3.explanation).toBe('Running loop 2 out 4 times; i = -5');
    expect(state3.variables['i'].value).toBe(-5);
    expect(state5.explanation).toBe('Running loop 3 out 4 times; i = -5');
    expect(state5.variables['i'].value).toBe(-5);
    expect(state7.explanation).toBe('Running loop 4 out 4 times; i = -5');
    expect(state7.variables['i'].value).toBe(-5);
    expect(
      [state1, state3, state5, state7].reduce((prev, next) => {
        return prev && next.blockId === info.loopBlock.id;
      }, true)
    );

    const debugBlock = info.loopBlock.getInput('DO').connection.targetBlock();

    expect(
      [state2, state4, state6, state8].reduce((prev, next) => {
        return prev && debugBlock && next.blockId === debugBlock.id;
      }, true)
    );
  });

  test('should loop -3 to 0 substracting by 1', () => {
    // -3, -2, -1, 0
  });

  test('should loop 1 to 10 by adding by 3', () => {});

  test('should loop 1 to 10 by adding by 2', () => {});

  test('should be able to handle having nothing inside the loop 1 to 10', () => {});

  test('should be able to handler nothing in the from, by, and to inputs', () => {});
});

const testloop = (
  workspace: Workspace,
  from: number,
  to: number,
  by: number,
  expectedNumberOfState: number
) => {
  const info = generateFrameForLoop(workspace, from, to, by);
  const states = info.frames;
  const debugBlock = info.loopBlock.getInput('DO').connection.targetBlock();

  expect(states.length).toBe(expectedNumberOfState);
  states.forEach((state, index) => {
    if (index % 2 == 0) {
    }
  });
  const [
    state1,
    state2,
    state3,
    state4,
    state5,
    state6,
    state7,
    state8
  ] = info.frames;

  expect(state1.explanation).toBe('Running loop 1 out 4 times; i = -3');
  expect(state1.variables['i'].value).toBe(-3);
  expect(state3.explanation).toBe('Running loop 2 out 4 times; i = -2');
  expect(state3.variables['i'].value).toBe(-5);
  expect(state5.explanation).toBe('Running loop 3 out 4 times; i = -1');
  expect(state5.variables['i'].value).toBe(-5);
  expect(state7.explanation).toBe('Running loop 4 out 4 times; i = 0');
  expect(state7.variables['i'].value).toBe(-5);
  expect(
    [state1, state3, state5, state7].reduce((prev, next) => {
      return prev && next.blockId === info.loopBlock.id;
    }, true)
  );

  expect(
    [state2, state4, state6, state8].reduce((prev, next) => {
      return prev && debugBlock && next.blockId === debugBlock.id;
    }, true)
  );
};

const generateFrameForLoop = (
  workspace: Workspace,
  from: number = null,
  to: number = null,
  by: number = null,
  nothingInLoop = false
) => {
  const forLoopNumber = workspace.newBlock('controls_for') as BlockSvg;

  if (from) {
    const fromNumberBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      from
    );
    forLoopNumber
      .getInput('FROM')
      .connection.connect(fromNumberBlock.outputConnection);
  }

  if (to) {
    const toNumberBlock = createValueBlock(workspace, VariableTypes.NUMBER, to);

    forLoopNumber
      .getInput('TO')
      .connection.connect(toNumberBlock.outputConnection);
  }

  if (by) {
    const byNumberBlock = createValueBlock(workspace, VariableTypes.NUMBER, by);

    forLoopNumber
      .getInput('BY')
      .connection.connect(byNumberBlock.outputConnection);
  }

  if (!nothingInLoop) {
    const debugBlock = workspace.newBlock('debug_block');
    forLoopNumber
      .getInput('DO')
      .connection.connect(debugBlock.previousConnection);
  }

  connectToArduinoBlock(forLoopNumber);

  const event: BlockEvent = {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: forLoopNumber.id
  };

  return {
    frames: eventToFrameFactory(event),
    loopBlock: forLoopNumber
  };
};
