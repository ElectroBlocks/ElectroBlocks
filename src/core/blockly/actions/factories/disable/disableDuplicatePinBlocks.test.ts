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
import { disableDuplicatePinBlocks } from './disableDuplicatePinBlocks';

describe('disableDuplicatePinBlocks', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('should disable 2 setup blocks that are taking up the same pins', () => {
    const setupBlock = workspace.newBlock('rfid_setup');
    setupBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'RX');
    setupBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, 'TX');

    const setupBlock2 = workspace.newBlock('bluetooth_setup');
    setupBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'RX');
    setupBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_10, 'TX');

    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const actions = disableDuplicatePinBlocks(event);

    expect(actions.length).toBe(2);
    expect(actions.map((a) => a.blockId)).toEqual([
      setupBlock.id,
      setupBlock2.id
    ]);
    expect(actions[0].warningText).toBe(
      'This blocks has these duplicate pins: ' + ARDUINO_UNO_PINS.PIN_5
    );
    expect(actions[1].warningText).toBe(
      'This blocks has these duplicate pins: ' + ARDUINO_UNO_PINS.PIN_5
    );
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });

  test('should allow fade and regular leds to use the same pins', () => {
    const setupBlock = workspace.newBlock('led');
    setupBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'PIN');

    const setupBlock2 = workspace.newBlock('led_fade');
    setupBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'PIN');

    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };
    const actions = disableDuplicatePinBlocks(event);

    expect(actions).toEqual([]);
  });

  test('should disable setup block and servo block that share the same pin number', () => {
    const servoBlock = workspace.newBlock('rotate_servo') as BlockSvg;
    servoBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'PIN');

    const servoBlock1 = workspace.newBlock('rotate_servo') as BlockSvg;
    servoBlock1.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'PIN');

    const servoBlock2 = workspace.newBlock('rotate_servo') as BlockSvg;
    servoBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_7, 'PIN');

    const servoBlock3 = workspace.newBlock('rotate_servo') as BlockSvg;
    servoBlock3.setFieldValue(ARDUINO_UNO_PINS.PIN_9, 'PIN');

    const sensorBlock = workspace.newBlock('rfid_setup');
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'RX');
    sensorBlock.setFieldValue(ARDUINO_UNO_PINS.PIN_9, 'TX');

    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const actions = disableDuplicatePinBlocks(event);

    expect(actions.length).toBe(4);
    expect(actions.map((a) => a.blockId)).toEqual([
      servoBlock.id,
      servoBlock1.id,
      servoBlock3.id,
      sensorBlock.id
    ]);
    expect(actions[0].warningText).toBe(
      'This blocks has these duplicate pins: ' + ARDUINO_UNO_PINS.PIN_5
    );
    expect(actions[1].warningText).toBe(
      'This blocks has these duplicate pins: ' + ARDUINO_UNO_PINS.PIN_5
    );
    expect(actions[2].warningText).toBe(
      'This blocks has these duplicate pins: ' + ARDUINO_UNO_PINS.PIN_9
    );
    expect(actions[3].warningText).toBe(
      'This blocks has these duplicate pins: ' +
        ARDUINO_UNO_PINS.PIN_5 +
        ', ' +
        ARDUINO_UNO_PINS.PIN_9
    );
  });
});
