import 'jest';
import '../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import {
  getAllBlocks,
  getBlockById,
  connectToArduinoBlock,
} from '../../../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../../blockly/state/event.data';
import { transformBlock } from '../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../blockly/transformers/variables.transformer';
import { saveSensorSetupBlockData } from '../../../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../../../blockly/updater';
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
} from '../../../../tests/tests.helper';
import { UltraSonicSensorState } from '../../arduino-components.state';
import { eventToFrameFactory } from '../../event-to-frame.factory';
import { ArduinoFrame, ArduinoComponentType } from '../../arduino.frame';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';
import { VariableTypes } from '../../../blockly/state/variable.data';

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
  });

  test('should be able generate state for ultra sonic sensor setup block', () => {
    saveLoopData(10, ultraSonicSensor, 1);
    saveLoopData(104, ultraSonicSensor, 2);
    saveLoopData(204, ultraSonicSensor, 3);

    const sensorBlock = workspace.newBlock('ultra_sonic_sensor_motion');

    const setVarNumBlock = createSetVariableBlockWithValue(
      workspace,
      'distance',
      VariableTypes.NUMBER,
      0
    );
    setVarNumBlock.getInput('VALUE').connection.targetBlock().dispose(true);

    setVarNumBlock
      .getInput('VALUE')
      .connection.connect(sensorBlock.outputConnection);

    connectToArduinoBlock(setVarNumBlock);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: setVarNumBlock.id,
    };

    const [setup, state1, state2, state3] = eventToFrameFactory(event);

    verifyState(state1, 10);
    verifyState(state2, 104);
    verifyState(state3, 204);
  });
});

const verifyState = (state: ArduinoFrame, distance: number) => {
  const component = state.components[0] as UltraSonicSensorState;
  expect(state.variables['distance'].value).toBe(distance);
  expect(component.cm).toBe(distance);
};

const saveLoopData = (distance: number, block: BlockSvg, loop: number) => {
  block.setFieldValue(loop.toString(), 'LOOP');
  block.setFieldValue(distance.toString(), 'cm');

  const event: BlockEvent = {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: Blockly.Events.BLOCK_MOVE,
    blockId: block.id,
  };

  saveSensorSetupBlockData(event).forEach(updater);
};
