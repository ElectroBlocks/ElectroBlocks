import _ from 'lodash';

import {
  SensorData,
  BluetoothData,
  ButtonData,
  IRRemoteData,
  PinData,
  TimeData,
  MotionSensorData,
  TempData,
  RFIDData
} from '../state/sensors.state';
import { BlockData } from '../state/block.data';
import { findFieldValue } from '../helpers/block-data.helper';

interface RetrieveSensorData {
  (block: BlockData): SensorData;
}

const bluetoothData = (block: BlockData): BluetoothData => {
  return {
    receiving_message: findFieldValue(block, 'receiving_message') === 'TRUE',
    message: findFieldValue(block, 'message'),
    loop: +findFieldValue(block, 'LOOP')
  };
};

const buttonData = (block: BlockData): ButtonData => {
  return {
    is_pressed: findFieldValue(block, 'is_pressed') === 'TRUE',
    loop: +findFieldValue(block, 'LOOP')
  };
};

const irRemoteData = (block: BlockData): IRRemoteData => {
  return {
    scanned_new_code: findFieldValue(block, 'scanned_new_code') === 'TRUE',
    code: findFieldValue(block, 'code'),
    loop: +findFieldValue(block, 'LOOP')
  };
};

const digitalReadSetup = (block: BlockData): PinData => {
  return {
    state: findFieldValue(block, 'has_power') === 'TRUE' ? 1 : 0,
    loop: +findFieldValue(block, 'LOOP')
  };
};

const analogReadSetup = (block: BlockData): PinData => {
  return {
    state: +findFieldValue(block, 'power_level'),
    loop: +findFieldValue(block, 'LOOP')
  };
};

const rfidSetup = (block: BlockData): RFIDData => {
  return {
    scanned_card: findFieldValue(block, 'scanned_card') === 'TRUE',
    card_number: findFieldValue(block, 'card_number'),
    tag: findFieldValue(block, 'tag'),
    loop: +findFieldValue(block, 'LOOP')
  };
};

const tempSetup = (block: BlockData): TempData => {
  return {
    temp: +findFieldValue(block, 'temp'),
    humidity: +findFieldValue(block, 'humidity'),
    loop: +findFieldValue(block, 'LOOP')
  };
};

const timeSetup = (block: BlockData): TimeData => {
  return {
    time_in_seconds: +findFieldValue(block, 'time_in_seconds'),
    loop: +findFieldValue(block, 'LOOP')
  };
};

const ultraSonicSensor = (block: BlockData): MotionSensorData => {
  return {
    cm: +findFieldValue(block, 'cm'),
    loop: +findFieldValue(block, 'LOOP')
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

export const convertToSensorData = (block: BlockData): SensorData => {
  if (!_.isFunction(blockToSensorData[block.blockName])) {
    throw new Error('No Sensor Data function found for ' + block.blockName);
  }

  return blockToSensorData[block.blockName](block);
};
