import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/state/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import { ArduinoFrame, ArduinoComponentType } from '../../arduino.frame';
import { TimeState } from '../../arduino-components.state';
import { createArduinoAndWorkSpace } from '../../../../tests/tests.helper';

describe('time state factories', () => {
  let workspace: Workspace;
  let timesetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    timesetup = workspace.newBlock('time_setup');

    timesetup.setFieldValue('.3', 'time_in_seconds');
  });

  test('should be able generate state for time setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: timesetup.id,
    };

    const timeState: TimeState = {
      pins: [],
      timeInSeconds: 0.3,
      type: ArduinoComponentType.TIME,
    };

    const state: ArduinoFrame = {
      blockId: timesetup.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up Arduino time.',
      components: [timeState],
      variables: {},
      txLedOn: false,
      rxLedOn: false,
      sendMessage: '', // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
    };

    expect(eventToFrameFactory(event)).toEqual([state]);
  });
});
