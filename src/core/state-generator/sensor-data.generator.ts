import { BlockSvg } from 'blockly';
import {
  SensorData,
  BluetoothData,
  ButtonData,
  IRRemoteData,
  PinData,
  TimeData
} from '../arduino-state/sensors.state';
import { getTopBlocks } from '../blockly/helpers/block.helper';
import { getTimesThroughLoop } from '../blockly/helpers/arduino_loop_block.helper';
import _ from 'lodash';
import { PIN_TYPE } from '../arduino-state/arduino-components.state';
import { sensorSetupBlocks } from '../blockly/helpers/block.contants';

export const getSensorData = (): SensorData[] => {
  return (
    getTopBlocks()
      .filter((block) => sensorSetupBlocks.includes(block.type))
      .filter((block) => block.isEnabled())
      .reduce((prev, curr: BlockSvg) => {
        const sensorData = JSON.parse(curr.data);
        if (!sensorData) {
          return prev;
        }
        return [...prev, ...sensorData];
      }, []) || []
  );
};

export const sensorStates = (block: BlockSvg) => {
  const sensorData = sensorState(block);
  // Reason for +1 is because it does not include end number
  return _.range(1, getTimesThroughLoop() + 1).map((loop) => {
    return {
      ...sensorData,
      loop
    };
  });
};

export const sensorState = (block: BlockSvg) => {
  if (!blockToSensorData[block.type]) {
    throw new Error('No Sensor Data found for setup block ' + block.type);
  }

  return blockToSensorData[block.type](block);
};

interface RetrieveSensorData {
  (block: BlockSvg): SensorData;
}

const bluetoothData = (block: BlockSvg): BluetoothData => {
  return {
    receiving_message: block.getFieldValue('receiving_message') === 'TRUE',
    message: block.getFieldValue('message'),
    loop: +block.getFieldValue('LOOP')
  };
};

const buttonData = (block: BlockSvg): ButtonData => {
  return {
    is_pressed: block.getFieldValue('is_pressed') === 'TRUE',
    pin: block.getFieldValue('PIN'),
    loop: +block.getFieldValue('LOOP')
  };
};

const irRemoteData = (block: BlockSvg): IRRemoteData => {
  return {
    scanned_new_code: block.getFieldValue('scanned_new_code') === 'TRUE',
    code: block.getFieldValue('code'),
    loop: +block.getFieldValue('LOOP')
  };
};

const digitalReadSetup = (block: BlockSvg): PinData => {
  return {
    pinType: PIN_TYPE.DIGITAL_INPUT,
    state: block.getFieldValue('has_power') === 'TRUE' ? 1 : 0,
    loop: +block.getFieldValue('LOOP'),
    pin: block.getFieldValue('PIN')
  };
};

const analogReadSetup = (block: BlockSvg): PinData => {
  return {
    pinType: PIN_TYPE.ANALOG_INPUT,
    state: +block.getFieldValue('power_level'),
    loop: +block.getFieldValue('LOOP'),
    pin: block.getFieldValue('PIN')
  };
};

const rfidSetup = (block: BlockSvg) => {
  return {
    scanned_card: block.getFieldValue('scanned_card') === 'TRUE',
    card_number: block.getFieldValue('card_number'),
    tag: block.getFieldValue('tag'),
    loop: +block.getFieldValue('LOOP')
  };
};

const tempSetup = (block: BlockSvg) => {
  return {
    temp: +block.getFieldValue('temp'),
    humidity: +block.getFieldValue('humidity'),
    loop: +block.getFieldValue('LOOP')
  };
};

const timeSetup = (block: BlockSvg): TimeData => {
  return {
    time_in_seconds: +block.getFieldValue('time_in_seconds'),
    loop: +block.getFieldValue('LOOP')
  };
};

const blockToSensorData: { [blockType: string]: RetrieveSensorData } = {
  bluetooth_setup: bluetoothData,
  button_setup: buttonData,
  ir_remote_setup: irRemoteData,
  digital_read_setup: digitalReadSetup,
  analog_read_setup: analogReadSetup,
  rfid_setup: rfidSetup,
  temp_setup: tempSetup,
  time_setup: timeSetup
};
