import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createValueBlock
} from '../../../../../tests/tests.helper';
import {
  connectToArduinoBlock,
  getAllBlocks
} from '../../../../blockly/helpers/block.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';

describe('factories delay state', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('should be able to delay for a certain number of seconds with and without input', () => {
    arduinoBlock.setFieldValue('1', 'LOOP_TIMES');
    const delayBlock = workspace.newBlock('delay_block') as BlockSvg;
    const numberBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      3.532342
    );
    delayBlock
      .getInput('DELAY')
      .connection.connect(numberBlock.outputConnection);
    connectToArduinoBlock(delayBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: delayBlock.id
    };

    const [state] = eventToFrameFactory(event);

    expect(state.explanation).toBe('Waiting for 3.53 seconds.');
    expect(state.delay).toBe(3.532342 * 1000);

    numberBlock.dispose(true);

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: delayBlock.id
    };

    const [event2state1] = eventToFrameFactory(event2);

    expect(event2state1.explanation).toBe('Waiting for 1.00 seconds.');
    expect(event2state1.delay).toBe(1000);
  });
});
