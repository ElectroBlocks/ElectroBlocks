import 'jest';
import '../../../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg } from 'blockly';
import { getAllBlocks } from '../../../helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../state/event.data';
import { transformBlock } from '../../../transformers/block.transformer';
import { getAllVariables } from '../../../helpers/variable.helper';
import { transformVariable } from '../../../transformers/variables.transformer';
import { ActionType } from '../../actions';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { disableSetupBlockWithMultiplePinOutsSamePins } from './disableSetupBlockWithMultiplePinOutsSamePins';
import { createArduinoAndWorkSpace } from '../../../../../tests/tests.helper';

describe('disableSensorReadBlocksWithWrongPins', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test('should disable blocks that use same pin twice', () => {
    const rfidBlockSetup = workspace.newBlock('rfid_setup');
    rfidBlockSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'RX');
    rfidBlockSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_5, 'TX');

    const setupBlock2 = workspace.newBlock('bluetooth_setup');
    setupBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_8, 'RX');
    setupBlock2.setFieldValue(ARDUINO_UNO_PINS.PIN_10, 'TX');
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };

    const actions = disableSetupBlockWithMultiplePinOutsSamePins(event);
    expect(actions.length).toBe(1);
    expect(actions[0].blockId).toBe(rfidBlockSetup.id);
    expect(actions[0].warningText).toBeDefined();
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  })
});