import 'jest';
import '../blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import { transformBlock } from './block.transformer';
import { transformEvent } from './event.transformer';
import * as helpers from '../helpers/workspace.helper';
import { getAllBlocks } from '../helpers/block.helper';
import _ from 'lodash';
import { getAllVariables } from '../helpers/variable.helper';
import { VariableTypes } from '../state/variable.data';
import { BluetoothSensor, RFIDSensor } from '../state/sensors.state';
import { getSensorData } from './sensor-data.transformer';

describe('sensor data transformer', () => {
  let workspace: Workspace;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('should return sensor data for sensor blocks only', () => {
    workspace.newBlock('rotate_servo');
    const bluetoothSetup = workspace.newBlock('bluetooth_setup');
    const btSensorSensorData: BluetoothSensor[] = [
      {
        receiving_message: true,
        message: 'blue',
        loop: 1,
        blockName: bluetoothSetup.type
      },
      {
        receiving_message: false,
        message: '',
        loop: 2,
        blockName: bluetoothSetup.type
      }
    ];
    bluetoothSetup.data = JSON.stringify(btSensorSensorData);

    const rfidSetup = workspace.newBlock('rfid_setup');
    const rfidSensorData: RFIDSensor[] = [
      {
        scanned_card: true,
        tag: 'tag1',
        card_number: 'card1',
        loop: 1,
        blockName: rfidSetup.type
      },
      {
        scanned_card: true,
        tag: 'tag2',
        card_number: 'card2',
        loop: 2,
        blockName: rfidSetup.type
      }
    ];
    rfidSetup.data = JSON.stringify(rfidSensorData);
    
    const blocks = getAllBlocks().map(transformBlock);
    const sensorData = getSensorData(blocks);
    expect(sensorData.length).toBe(4);
  });
});
