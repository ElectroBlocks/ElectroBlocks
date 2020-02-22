import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import { getAllBlocks, getBlockById } from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/state/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';
import { ButtonState, IRRemoteState } from '../../state/arduino-components.state';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ArduinoState, ArduinoComponentType } from '../../state/arduino.state';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';

describe('button frame factories', () => {
  let workspace: Workspace;
  let irRemoteSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    irRemoteSetup = workspace.newBlock('ir_remote_setup') as BlockSvg;
    irRemoteSetup.setFieldValue(ARDUINO_UNO_PINS.PIN_A4, 'PIN');
    irRemoteSetup.setFieldValue('TRUE', 'scanned_new_code');
    irRemoteSetup.setFieldValue('32343', 'code');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: irRemoteSetup.id
    };
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it('should be able generate state for ir remote read setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: irRemoteSetup.id
    };

    const irRemote: IRRemoteState = {
      code: '32343',
      pins: [ARDUINO_UNO_PINS.PIN_A4],
      hasCode: true,
      analogPin: ARDUINO_UNO_PINS.PIN_A4,
      type: ArduinoComponentType.IR_REMOTE
    };

    const state: ArduinoState = {
      blockId: irRemoteSetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up ir remote.',
      components: [irRemote],
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
