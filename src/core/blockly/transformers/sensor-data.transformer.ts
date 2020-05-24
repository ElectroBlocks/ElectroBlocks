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
  RFIDSensor,
} from '../state/sensors.state';
import { BlockData, BlockType } from '../state/block.data';
import { findFieldValue } from '../helpers/block-data.helper';
import {
  Timeline,
  ArduinoComponentState,
  ArduinoComponentType,
} from '../../frames/arduino.frame';
import {
  BluetoothState,
  ButtonState,
  IRRemoteState,
  PinState,
  PIN_TYPE,
  RfidState,
  TemperatureState,
  TimeState,
  UltraSonicSensorState,
  ArduinoMessageState,
} from '../../frames/arduino-components.state';
import { ARDUINO_UNO_PINS } from '../../../constants/arduino';

interface RetrieveSensorData {
  (block: BlockData): Sensor;
}

interface BlockToComponentState {
  (block: BlockData, timeline: Timeline): ArduinoComponentState;
}

const bluetoothData = (block: BlockData): BluetoothSensor => {
  return {
    receiving_message: findFieldValue(block, 'receiving_message') === 'TRUE',
    message: findFieldValue(block, 'message'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const bluetoothState = (
  block: BlockData,
  timeline: Timeline
): BluetoothState => {
  const sensorStates = JSON.parse(block.metaData) as BluetoothSensor[];

  const btState = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as BluetoothSensor;

  return {
    type: ArduinoComponentType.BLUE_TOOTH,
    rxPin: findFieldValue(block, 'RX') as ARDUINO_UNO_PINS,
    txPin: findFieldValue(block, 'TX') as ARDUINO_UNO_PINS,
    pins: [
      findFieldValue(block, 'TX') as ARDUINO_UNO_PINS,
      findFieldValue(block, 'RX') as ARDUINO_UNO_PINS,
    ],
    hasMessage: btState.receiving_message,
    message: btState.message,
    sendMessage: '',
  };
};

const buttonData = (block: BlockData): ButtonSensor => {
  return {
    is_pressed: findFieldValue(block, 'is_pressed') === 'TRUE',
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const buttonState = (block: BlockData, timeline: Timeline): ButtonState => {
  const sensorStates = JSON.parse(block.metaData) as ButtonSensor[];

  const btState = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as ButtonSensor;

  return {
    type: ArduinoComponentType.BUTTON,
    pins: [findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS],
    isPressed: btState.is_pressed,
  };
};

const irRemoteData = (block: BlockData): IRRemoteSensor => {
  return {
    scanned_new_code: findFieldValue(block, 'scanned_new_code') === 'TRUE',
    code: findFieldValue(block, 'code'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const irRemoteState = (block: BlockData, timeline: Timeline): IRRemoteState => {
  const sensorStates = JSON.parse(block.metaData) as IRRemoteSensor[];

  const irRemoteData = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as IRRemoteSensor;

  return {
    type: ArduinoComponentType.IR_REMOTE,
    analogPin: findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS,
    pins: [findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS],
    code: irRemoteData.code,
    hasCode: irRemoteData.scanned_new_code,
  };
};

const digitalReadSetup = (block: BlockData): PinSensor => {
  return {
    state: findFieldValue(block, 'has_power') === 'TRUE' ? 1 : 0,
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const pinReadState = (pinType: PIN_TYPE) => {
  return (block: BlockData, timeline: Timeline) => {
    const sensorStates = JSON.parse(block.metaData) as PinSensor[];

    const pinSensor = sensorStates.find(
      (s) => s.loop === timeline.iteration
    ) as PinSensor;

    const pictureType = findFieldValue(block, 'TYPE');

    return {
      type: ArduinoComponentType.PIN,
      pin: findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS,
      pins: [findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS],
      state: pinSensor.state,
      pinType: pinType,
      pinPicture: pictureType,
    };
  };
};

const analogReadSetup = (block: BlockData): PinSensor => {
  return {
    state: +findFieldValue(block, 'power_level'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const rfidSetup = (block: BlockData): RFIDSensor => {
  return {
    scanned_card: findFieldValue(block, 'scanned_card') === 'TRUE',
    card_number: findFieldValue(block, 'card_number'),
    tag: findFieldValue(block, 'tag'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const rfidState = (block: BlockData, timeline): RfidState => {
  const sensorStates = JSON.parse(block.metaData) as RFIDSensor[];

  const rfidSensor = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as RFIDSensor;

  return {
    type: ArduinoComponentType.RFID,
    rxPin: findFieldValue(block, 'RX') as ARDUINO_UNO_PINS,
    txPin: findFieldValue(block, 'TX') as ARDUINO_UNO_PINS,
    pins: [
      findFieldValue(block, 'TX') as ARDUINO_UNO_PINS,
      findFieldValue(block, 'RX') as ARDUINO_UNO_PINS,
    ],
    scannedCard: rfidSensor.scanned_card,
    cardNumber: rfidSensor.card_number,
    tag: rfidSensor.tag,
  };
};

const tempSetup = (block: BlockData): TempSensor => {
  return {
    temp: +findFieldValue(block, 'temp'),
    humidity: +findFieldValue(block, 'humidity'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const tempState = (block: BlockData, timeline: Timeline): TemperatureState => {
  const sensorStates = JSON.parse(block.metaData) as TempSensor[];

  const tempSensor = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as TempSensor;

  return {
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
    pins: [findFieldValue(block, 'PIN') as ARDUINO_UNO_PINS],
    temperature: tempSensor.temp,
    humidity: tempSensor.humidity,
  };
};

const timeSetup = (block: BlockData): TimeSensor => {
  return {
    time_in_seconds: +findFieldValue(block, 'time_in_seconds'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const timeState = (block: BlockData, timeline: Timeline): TimeState => {
  return {
    type: ArduinoComponentType.TIME,
    pins: [],
    timeInSeconds:
      +timeline.iteration * +findFieldValue(block, 'time_in_seconds'),
  };
};

const ultraSonicSensor = (block: BlockData): MotionSensor => {
  return {
    cm: +findFieldValue(block, 'cm'),
    loop: +findFieldValue(block, 'LOOP'),
    blockName: block.blockName,
  };
};

const ultraSonicState = (
  block: BlockData,
  timeline: Timeline
): UltraSonicSensorState => {
  const sensorStates = JSON.parse(block.metaData) as MotionSensor[];

  const ultraSensor = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as MotionSensor;

  return {
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
    trigPin: findFieldValue(block, 'TRIG') as ARDUINO_UNO_PINS,
    echoPin: findFieldValue(block, 'ECHO') as ARDUINO_UNO_PINS,
    pins: [
      findFieldValue(block, 'TRIG') as ARDUINO_UNO_PINS,
      findFieldValue(block, 'ECHO') as ARDUINO_UNO_PINS,
    ],
    cm: ultraSensor.cm,
  };
};

const messageState = (
  block: BlockData,
  timeline: Timeline
): ArduinoMessageState => {
  const sensorStates = JSON.parse(block.metaData) as BluetoothSensor[];

  const btState = sensorStates.find(
    (s) => s.loop === timeline.iteration
  ) as BluetoothSensor;

  return {
    type: ArduinoComponentType.MESSAGE,
    pins: [],
    hasMessage: btState.receiving_message,
    message: btState.message,
    sendMessage: '',
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
  message_setup: bluetoothData,
};

const blockToSensorComponent: {
  [blockName: string]: BlockToComponentState;
} = {
  bluetooth_setup: bluetoothState,
  button_setup: buttonState,
  ir_remote_setup: irRemoteState,
  digital_read_setup: pinReadState(PIN_TYPE.DIGITAL_INPUT),
  analog_read_setup: pinReadState(PIN_TYPE.ANALOG_INPUT),
  rfid_setup: rfidState,
  temp_setup: tempState,
  time_setup: timeState,
  ultra_sonic_sensor_setup: ultraSonicState,
  message_setup: messageState,
};

export const sensorSetupBlockName = _.keys(blockToSensorComponent);

export const convertToState = (
  block: BlockData,
  timeline: Timeline
): ArduinoComponentState => {
  if (!_.isFunction(blockToSensorComponent[block.blockName])) {
    throw new Error('No Sensor Data function found for ' + block.blockName);
  }

  return blockToSensorComponent[block.blockName](block, timeline);
};

export const convertToSensorData = (block: BlockData): Sensor => {
  if (!_.isFunction(blockToSensorData[block.blockName])) {
    throw new Error('No Sensor Data function found for ' + block.blockName);
  }

  return blockToSensorData[block.blockName](block);
};
