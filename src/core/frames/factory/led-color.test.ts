import '../../blockly/blocks';
import Blockly, { Workspace } from 'blockly';
import { getAllBlocks } from '../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../blockly/state/event.data';
import { transformBlock } from '../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../blockly/helpers/variable.helper';
import { transformVariable } from '../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';
import { ArduinoState, ArduinoComponentType } from '../state/arduino.state';
import {
  LCDScreenState,
  LCD_SCREEN_MEMORY_TYPE,
  LedColorState,
  PinPicture
} from '../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../tests/tests.helper';

describe('lcd  factories', () => {
  let workspace: Workspace;
  let ledColor;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    ledColor = workspace.newBlock('led_color_setup');
    ledColor.setFieldValue('11-10-9', 'WIRE');
    ledColor.setFieldValue('BUILT_IN', 'PICTURE_TYPE');
  });

  test('should be able generate state for led color setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ledColor.id
    };

    const ledColorState: LedColorState = {
      pins: [
        ARDUINO_UNO_PINS.PIN_11,
        ARDUINO_UNO_PINS.PIN_10,
        ARDUINO_UNO_PINS.PIN_9
      ],
      redPin: ARDUINO_UNO_PINS.PIN_11,
      greenPin: ARDUINO_UNO_PINS.PIN_10,
      bluePin: ARDUINO_UNO_PINS.PIN_9,
      pictureType: 'BUILT_IN',
      color: { green: 0, red: 0, blue: 0 },
      type: ArduinoComponentType.NEO_PIXEL_STRIP
    };

    const state: ArduinoState = {
      blockId: ledColor.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up color led.',
      components: [ledColorState],
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
