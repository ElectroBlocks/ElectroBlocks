import 'jest';
import '../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import { getAllBlocks, getBlockById } from '../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../blockly/state/event.data';
import { transformBlock } from '../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../blockly/helpers/variable.helper';
import { transformVariable } from '../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../blockly/updater';
import { ArduinoState, ArduinoComponentType } from '../state/arduino.state';
import { createArduinoAndWorkSpace } from '../../../tests/tests.helper';
import { PinState, PIN_TYPE, PinPicture } from '../state/arduino-components.state';

describe('bluetooth frame factories', () => {
  let workspace: Workspace;
  let analogReadSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    analogReadSetup = workspace.newBlock('analog_read_setup') as BlockSvg;
    analogReadSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_A1, 'PIN');
    analogReadSetup.setFieldValue('PHOTO_SENSOR', 'TYPE');
    analogReadSetup.setFieldValue('30', 'power_level');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: analogReadSetup.id
    };

    saveSensorSetupBlockData(event).forEach(updater);
  });

  test('should be able generate state for analog read setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: analogReadSetup.id
    };

    const sensor: PinState = {
      pins: [ARDUINO_UNO_PINS.PIN_A1],
      pin: ARDUINO_UNO_PINS.PIN_A1,
      pinType: PIN_TYPE.ANALOG_INPUT,
      state: 30,
      pinPicture: PinPicture.PHOTO_SENSOR,
      type: ArduinoComponentType.PIN
    };

    const state: ArduinoState = {
      blockId: analogReadSetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up photo sensor.',
      components: [sensor],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true
    };

    expect(eventToFrameFactory(event)).toEqual([state]);
  });
});
