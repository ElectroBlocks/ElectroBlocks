import 'jest';
import '../../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import * as helpers from '../../helpers/workspace.helper';
import { getAllBlocks } from '../../helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../../state/event.data';
import { transformBlock } from '../../transformers/block.transformer';
import { getAllVariables } from '../../helpers/variable.helper';
import { transformVariable } from '../../transformers/variables.transformer';
import { saveSensorSetupBlockData } from './saveSensorSetupBlockData';
import { MotionSensorData } from '../../state/sensors.state';
import { ActionType } from '../actions';

describe('saveSensorSetupBlockData', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('no action if block is not a sensor setup block', () => {
    const event: BlockEvent = {
      blockId: arduinoBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_MOVE
    };
    const actions = saveSensorSetupBlockData(event);
    expect(actions).toEqual([]);
  });

  test('no action if the block loop field is being changed', () => {
    const sensorBlock = workspace.newBlock('rfid_setup');
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: '2',
      oldValue: '1',
      fieldName: 'LOOP',
      fieldType: 'field'
    };
    const actions = saveSensorSetupBlockData(event);
    expect(actions).toEqual([]);
  });

  test('create an action for a block with no metadata', () => {
    const sensorBlock = workspace.newBlock('ultra_sonic_sensor_setup');
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: '2',
      oldValue: '1',
      fieldName: 'cm',
      fieldType: 'field'
    };

    const expectedData = [
      {
        loop: 1,
        cm: 1
      },
      {
        loop: 2,
        cm: 1
      },
      {
        loop: 3,
        cm: 1
      }
    ];

    const actions = saveSensorSetupBlockData(event);

    expect(JSON.parse(actions[0].data)).toEqual(expectedData);
    expect(actions[0].type).toEqual(
      ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
    );
    expect(actions[0].blockId).toEqual(sensorBlock.id);
  });

  test('create an action for a block already has metadata.  Should replace what is ther for the loop selected', () => {
    const sensorBlock = workspace.newBlock('ultra_sonic_sensor_setup');
    const currentMetadata = [
      {
        loop: 1,
        cm: 1
      },
      {
        loop: 2,
        cm: 1
      },
      {
        loop: 3,
        cm: 1
      }
    ];

    sensorBlock.setFieldValue('2', 'LOOP');
    sensorBlock.data = JSON.stringify(currentMetadata);
    sensorBlock.setFieldValue('10', 'cm');
    const event: BlockEvent = {
      blockId: sensorBlock.id,
      variables: getAllVariables().map(transformVariable),
      blocks: getAllBlocks().map(transformBlock),
      type: Blockly.Events.BLOCK_CHANGE,
      newValue: '10',
      oldValue: '1',
      fieldName: 'cm',
      fieldType: 'field'
    };

    const actions = saveSensorSetupBlockData(event);
    const metadataToSave = JSON.parse(actions[0].data) as MotionSensorData[];
    expect(metadataToSave.length).toBe(3);
    metadataToSave.forEach((data) => {
      const expectedcm = data.loop == 2 ? 10 : 1;
      expect(data.cm).toBe(expectedcm);
    });

    expect(actions[0].type).toEqual(
      ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA
    );
    expect(actions[0].blockId).toEqual(sensorBlock.id);
  });
});
