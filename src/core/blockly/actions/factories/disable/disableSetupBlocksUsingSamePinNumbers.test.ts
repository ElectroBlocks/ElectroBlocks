

import 'jest';
import '../../../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import { getAllBlocks } from '../../../helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../state/event.data';
import { transformBlock } from '../../../transformers/block.transformer';
import { getAllVariables } from '../../../helpers/variable.helper';
import { transformVariable } from '../../../transformers/variables.transformer';
import { ActionType } from '../../actions';
import { disableSetupBlocksUsingSamePinNumbers } from './disableSetupBlocksUsingSamePinNumbers';
import { createArduinoAndWorkSpace } from '../../../../../tests/tests.helper';

describe('disableSetupBlocksUsingSamePinNumbers', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });


  test('should disble blocks with NO_PINS in the pin dropdown', () => {
    
    workspace.newBlock('analog_read_setup');
    workspace.newBlock('analog_read_setup');
    workspace.newBlock('analog_read_setup');
    workspace.newBlock('analog_read_setup');
    workspace.newBlock('analog_read_setup');
    workspace.newBlock('analog_read_setup'); 
   const block =  workspace.newBlock('analog_read_setup'); // because there are only 6 analog pins the last block should be disabled
   console.log(block.getFieldValue('PIN'), 'test pin');
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };
    const actions = disableSetupBlocksUsingSamePinNumbers(event);
    expect(actions.length).toBe(1);
    expect(actions[0].blockId).toBeDefined();
    expect(actions[0].warningText).toBeDefined();
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });

});