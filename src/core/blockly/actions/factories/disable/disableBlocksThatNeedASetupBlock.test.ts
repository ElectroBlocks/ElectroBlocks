import 'jest';
import '../../../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import * as helpers from '../../../helpers/workspace.helper';
import { getAllBlocks } from '../../../helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../state/event.data';
import { transformBlock } from '../../../transformers/block.transformer';
import { getAllVariables } from '../../../helpers/variable.helper';
import { transformVariable } from '../../../transformers/variables.transformer';
import { disableBlocksThatNeedASetupBlock } from './disableBlocksThatNeedASetupBlock';
import { ActionType } from '../../actions';

describe('disableBlocksThatNeedASetupBlock', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('disable blocks require a setup block', () => {
    workspace.newBlock('arduino_send_message');
    workspace.newBlock('message_setup');
    workspace.newBlock('button_setup');
    workspace.newBlock('button_setup');
    workspace.newBlock('is_button_pressed');
    workspace.newBlock('is_button_pressed');
    workspace.newBlock('is_button_pressed');
    const bluetoothBlockId = workspace.newBlock('bluetooth_send_message').id;
    const lcdScreenClearBlockId = workspace.newBlock('lcd_screen_clear').id;
    const idsThatShouldBeDisabled = [bluetoothBlockId, lcdScreenClearBlockId];
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };
    const disableActions = disableBlocksThatNeedASetupBlock(event);

    expect(idsThatShouldBeDisabled).toEqual(
      disableActions.map((a) => a.blockId)
    );
    expect(disableActions[0].type).toBe(ActionType.DISABLE_BLOCK);
    disableActions.forEach((a) => {
      expect(a.warningText).toContain('This block requires a ');
      expect(a.warningText).not.toContain('undefined');
      console.log(a.warningText);
    });
  });
});
