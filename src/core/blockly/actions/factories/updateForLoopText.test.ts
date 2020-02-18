import 'jest';
import '../../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import * as helpers from '../../helpers/workspace.helper';
import { getAllBlocks } from '../../helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../state/event.data';
import { transformBlock } from '../../transformers/block.transformer';
import updateForLoopText from './updateForLoopText';
import { ForLoopTextChange, ActionType } from '../actions';
import { getAllVariables } from '../../helpers/variable.helper';
import { transformVariable } from '../../transformers/variables.transformer';

describe('updateForLoopText', () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('should return an empty array if no for blocks are present', () => {
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    expect(updateForLoopText(event)).toEqual([]);
  });

  test('from number greater than to number', () => {
    const forBlock = createForLoopBlock(30, 10);
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE
    };

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: 'by subtracting',
      type: ActionType.FOR_LOOP_BLOCK_CHANGE
    }

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  test('to number greater than from number', () => {
    const forBlock = createForLoopBlock(10, 30);
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: 'by adding',
      type: ActionType.FOR_LOOP_BLOCK_CHANGE
    }

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  test('empty for loop block uses by', () => {
    const forBlock = workspace.newBlock('controls_for');
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: 'by',
      type: ActionType.FOR_LOOP_BLOCK_CHANGE
    }

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  test('variables for number block uses by', () => {
    const forBlock = workspace.newBlock('controls_for');
    const fromBlock = workspace.newBlock('variables_get_number')
    const toBlock = workspace.newBlock('math_number');

    forBlock.getInput('TO').connection.connect(toBlock.outputConnection);
    forBlock.getInput('FROM').connection.connect(fromBlock.outputConnection);

    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: 'by',
      type: ActionType.FOR_LOOP_BLOCK_CHANGE
    }

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });


  const createForLoopBlock = (from: number, to: number) => {
    const forBlock = workspace.newBlock('controls_for');
    const toBlock = workspace.newBlock('math_number');
    const fromBlock = workspace.newBlock('math_number');
    toBlock.setFieldValue(to.toString(), 'NUM');
    fromBlock.setFieldValue(from.toString(), 'NUM');
    forBlock.getInput('TO').connection.connect(toBlock.outputConnection);
    forBlock.getInput('FROM').connection.connect(fromBlock.outputConnection);

    return forBlock;
  };
});
