import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
} from '../../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { saveSensorSetupBlockData } from '../../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../../blockly/updater';
import { createArduinoAndWorkSpace } from '../../../../../tests/tests.helper';
import { UltraSonicSensorState } from '../../../state/arduino-components.state';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ArduinoFrame, ArduinoComponentType } from '../../../arduino.frame';
import { ARDUINO_UNO_PINS } from '../../../../../constants/arduino';

describe('ultra sonic sensor state factories', () => {
  let workspace: Workspace;
  let ultraSonicSensor;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    ultraSonicSensor = workspace.newBlock(
      'ultra_sonic_sensor_setup'
    ) as BlockSvg;
    ultraSonicSensor.setFieldValue('11', 'TRIG');
    ultraSonicSensor.setFieldValue('12', 'ECHO');
    ultraSonicSensor.setFieldValue('10', 'cm');

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ultraSonicSensor.id,
    };
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test('should be able generate state for ultra sonic sensor setup block', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: ultraSonicSensor.id,
    };

    const ultraSonicSensorState: UltraSonicSensorState = {
      pins: [ARDUINO_UNO_PINS.PIN_11, ARDUINO_UNO_PINS.PIN_12],
      echoPin: ARDUINO_UNO_PINS.PIN_12,
      trigPin: ARDUINO_UNO_PINS.PIN_11,
      cm: 10,
      type: ArduinoComponentType.ULTRASONICE_SENSOR,
    };

    const state: ArduinoFrame = {
      blockId: ultraSonicSensor.id,
      timeLine: { function: 'pre-setup', iteration: 0 },
      explanation: 'Setting up ultra sonic sensor.',
      components: [ultraSonicSensorState],
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
