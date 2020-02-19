import _ from 'lodash';

import {
  Sensor,
  BluetoothSensor,
  ButtonSensor,
  IRRemoteSensor,
  PinSensor,
  TimeSensor,
  MotionSensor,
  TempSensor,
  RFIDSensor
} from '../state/sensors.state';
import { BlockData, BlockType } from '../state/block.data';
import { findFieldValue } from '../helpers/block-data.helper';

interface RetrieveSensorData {
  (block: BlockData): Sensor;
}

const bluetoothData = (block: BlockData): BluetoothSensor => {
  return {
    receiving_message: findFieldValue(block, 'receiving_message') === 'TRUE',
    message: findFieldValue(block, 'message'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const buttonData = (block: BlockData): ButtonSensor => {
  return {
    is_pressed: findFieldValue(block, 'is_pressed') === 'TRUE',
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const irRemoteData = (block: BlockData): IRRemoteSensor => {
  return {
    scanned_new_code: findFieldValue(block, 'scanned_new_code') === 'TRUE',
    code: findFieldValue(block, 'code'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const digitalReadSetup = (block: BlockData): PinSensor => {
  return {
    state: findFieldValue(block, 'has_power') === 'TRUE' ? 1 : 0,
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const analogReadSetup = (block: BlockData): PinSensor => {
  return {
    state: +findFieldValue(block, 'power_level'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const rfidSetup = (block: BlockData): RFIDSensor => {
  return {
    scanned_card: findFieldValue(block, 'scanned_card') === 'TRUE',
    card_number: findFieldValue(block, 'card_number'),
    tag: findFieldValue(block, 'tag'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const tempSetup = (block: BlockData): TempSensor => {
  return {
    temp: +findFieldValue(block, 'temp'),
    humidity: +findFieldValue(block, 'humidity'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const timeSetup = (block: BlockData): TimeSensor => {
  return {
    time_in_seconds: +findFieldValue(block, 'time_in_seconds'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const ultraSonicSensor = (block: BlockData): MotionSensor => {
  return {
    cm: +findFieldValue(block, 'cm'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName
  };
};

const blockToSensorData: { [blockName: string]: RetrieveSensorData } = {
  bluetooth_setup: bluetoothData,
  button_setup: buttonData,
  ir_remote_setup: irRemoteData,
  digital_read_setup: digitalReadSetup,
  analog_read_setup: analogReadSetup,
  rfid_setup: rfidSetup,
  temp_setup: tempSetup,
  time_setup: timeSetup,
  ultra_sonic_sensor_setup: ultraSonicSensor,
  message_setup: bluetoothData
};

export const convertToSensorData = (block: BlockData): Sensor => {
  if (!_.isFunction(blockToSensorData[block.blockName])) {
    throw new Error('No Sensor Data function found for ' + block.blockName);
  }

  return blockToSensorData[block.blockName](block);
};

export const getSensorData = (blocks: BlockData[]): Sensor[] => {
  return blocks
    .filter((b) => b.type === BlockType.SENSOR_SETUP)
    .map((b) => JSON.parse(b.metaData) as Sensor[])
    .reduce((p, n) => [...p, ...n], []);
};
