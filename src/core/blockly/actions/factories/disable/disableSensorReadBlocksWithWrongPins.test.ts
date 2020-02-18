import 'jest';
import '../../../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg } from 'blockly';
import * as helpers from '../../../helpers/workspace.helper';
import { getAllBlocks } from '../../../helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../state/event.data';
import { transformBlock } from '../../../transformers/block.transformer';
import { getAllVariables } from '../../../helpers/variable.helper';
import { transformVariable } from '../../../transformers/variables.transformer';
import { ActionType } from '../../actions';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { disableSensorReadBlocksWithWrongPins } from './disableSensorReadBlocksWithWrongPins';

describe('disableSensorReadBlocksWithWrongPins', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('sensor read blocks that have pins select that are not selected by the setup block are disabled', () => {
    const btnSetup1 = workspace.newBlock('button_setup');
    btnSetup1.setFieldValue(ARDUINO_UNO_PINS.PIN_10, 'PIN');
    const btnSetup2 = workspace.newBlock('button_setup');
    btnSetup2.setFieldValue(ARDUINO_UNO_PINS.PIN_4, 'PIN');
    const btnSetup3 = workspace.newBlock('button_setup');
    btnSetup3.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'PIN');

    const btnPressed1 = workspace.newBlock('is_button_pressed');
    btnPressed1.setFieldValue(ARDUINO_UNO_PINS.PIN_10, 'PIN');
    const btnPressed2 = workspace.newBlock('is_button_pressed');
    btnPressed2.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'PIN');

    const btnPressed4 = workspace.newBlock('is_button_pressed');
    btnPressed4.setFieldValue(ARDUINO_UNO_PINS.PIN_4, 'PIN');

    // Done so that we can set the field value to 10 on one of the blocks.
    // Then change the setup block to make sure it disables the sensor read block
    btnSetup1.setFieldValue(ARDUINO_UNO_PINS.PIN_3, 'PIN');

    // These blocks should not be affected because they don't have a setup block
    // Another function will disable theses blocks.
    workspace.newBlock('arduino_send_message');
    workspace.newBlock('analog_read');

    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const actions = disableSensorReadBlocksWithWrongPins(event);

    expect(actions.length).toBe(1);

    expect(actions[0].blockId).toBe(btnPressed1.id);
    expect(actions[0].warningText).toBe(
      'Please change the pin number to match the setup block'
    );
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });
});
