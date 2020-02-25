import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../../blockly/updater';
import {
  ArduinoState,
  ArduinoComponentType
} from '../../../state/arduino.state';
import { createArduinoAndWorkSpace } from '../../../../../tests/tests.helper';
import {
  PinState,
  PIN_TYPE,
  PinPicture
} from '../../../state/arduino-components.state';

describe('analog pin state factories', () => {
  let workspace: Workspace;
  let analogReadSetup;
  let digitalReadSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    analogReadSetup = workspace.newBlock('analog_read_setup') as BlockSvg;
    analogReadSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_A1, 'PIN');
    analogReadSetup.setFieldValue('PHOTO_SENSOR', 'TYPE');
    analogReadSetup.setFieldValue('30', 'power_level');

    digitalReadSetup = workspace.newBlock('digital_read_setup') as BlockSvg;
    digitalReadSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_6, 'PIN');
    digitalReadSetup.setFieldValue('TOUCH_SENSOR', 'TYPE');
    digitalReadSetup.setFieldValue('1', 'has_power');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: analogReadSetup.id
    };

    saveSensorSetupBlockData(event).forEach(updater);

    const event2: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: digitalReadSetup.id
    };

    saveSensorSetupBlockData(event2).forEach(updater);
  });

  test('should be able generate state for analog and digital read setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: analogReadSetup.id
    };

    expect(eventToFrameFactory(event)).toEqual([
      createSetupFrame(
        analogReadSetup.id,
        PinPicture.PHOTO_SENSOR,
        ARDUINO_UNO_PINS.PIN_A1,
        PIN_TYPE.ANALOG_INPUT,
        'Setting up photo sensor.',
        30
      ),
      createSetupFrame(
        digitalReadSetup.id,
        PinPicture.TOUCH_SENSOR,
        ARDUINO_UNO_PINS.PIN_6,
        PIN_TYPE.DIGITAL_INPUT,
        'Setting up touch sensor.',
        1
      )
    ]);
  });

  const createSetupFrame = (
    blockId: string,
    pinPicture: PinPicture,
    pin: ARDUINO_UNO_PINS,
    pinType: PIN_TYPE,
    explanation: string,
    state: number
  ): ArduinoState => {
    const sensor: PinState = {
      pins: [pin],
      pin,
      pinType,
      state,
      pinPicture,
      type: ArduinoComponentType.PIN
    };

    return {
      blockId,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation,
      components: [sensor],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true
    };
  };
});
