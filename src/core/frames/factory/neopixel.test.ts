import 'jest';
import '../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from 'blockly';
import { getAllBlocks } from '../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../blockly/state/event.data';
import { transformBlock } from '../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../blockly/helpers/variable.helper';
import { transformVariable } from '../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';
import { ArduinoState, ArduinoComponentType } from '../state/arduino.state';
import { NeoPixelState } from '../state/arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../tests/tests.helper';
import { BluetoothSensor } from '../../blockly/state/sensors.state';

describe('neo pixle frame factories', () => {
  let workspace: Workspace;
  let neoPixelSetup: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    neoPixelSetup = workspace.newBlock('neo_pixel_setup') as BlockSvg;
    neoPixelSetup.setFieldValue('60', 'NUMBER_LEDS');
    neoPixelSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_6, 'PIN');
  });

  test('should be able generate state for neo pixel setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: neoPixelSetup.id
    };

    const ledLightStrip: NeoPixelState = {
      pins: [ARDUINO_UNO_PINS.PIN_6],
      numberOfLeds: 60,
      type: ArduinoComponentType.NEO_PIXEL_STRIP,
      neoPixels: _.range(0, 60).map((i) => {
        return {
          position: i,
          color: { red: 0, green: 0, blue: 0 }
        };
      })
    };

    const state: ArduinoState = {
      blockId: neoPixelSetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up led light strip.',
      components: [ledLightStrip],
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
