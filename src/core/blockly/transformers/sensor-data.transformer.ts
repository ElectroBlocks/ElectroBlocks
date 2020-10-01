import _ from "lodash";

import {
  Sensor,
  PinSensor,
  TimeSensor,
  MotionSensor,
  TempSensor,
  RFIDSensor,
} from "../dto/sensors.type";
import { BlockData, BlockType } from "../dto/block.type";
import { findFieldValue } from "../helpers/block-data.helper";
import {
  Timeline,
  ArduinoComponentState,
  ArduinoComponentType,
} from "../../frames/arduino.frame";
import {
  PIN_TYPE,
  RfidState,
  TemperatureState,
  TimeState,
  UltraSonicSensorState,
  ArduinoReceiveMessageState,
} from "../../frames/arduino-components.state";
import { ARDUINO_PINS } from "../../microcontroller/selectBoard";
import { findSensorState } from "../helpers/sensor_block.helper";
import { BluetoothSensor } from "../../../blocks/bluetooth/state";
import { bluetoothSetupBlockToSensorData } from "../../../blocks/bluetooth/setupblocktosensordata";
import { buttonSetupBlockToSensorData } from "../../../blocks/button/setupblocktosensordata";
import { bluetoothSetupBlockToComponentState } from "../../../blocks/bluetooth/setupblocktocomponentstate";
import { buttonSetupBlockToComponentState } from "../../../blocks/button/setupblocktocomponentstate";
import { irRemoteSetupBlocktoSensorData } from "../../../blocks/ir_remote/setupblocktosensordata";
import { irRemoteSetupBlockToComponentState } from "../../../blocks/ir_remote/setupblocktocomponentstate";

interface RetrieveSensorData {
  (block: BlockData): Sensor;
}

interface BlockToComponentState {
  (block: BlockData, timeline: Timeline): ArduinoComponentState;
}

const digitalReadSetup = (block: BlockData): PinSensor => {
  return {
    state: findFieldValue(block, "state") === "TRUE" ? 1 : 0,
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const pinReadState = (pinType: PIN_TYPE) => {
  return (block: BlockData, timeline: Timeline) => {
    const pinSensor = findSensorState<PinSensor>(block, timeline);

    const pictureType = findFieldValue(block, "TYPE");

    return {
      type: ArduinoComponentType.PIN,
      pin: findFieldValue(block, "PIN") as ARDUINO_PINS,
      pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
      state: pinSensor.state,
      pinType: pinType,
      pinPicture: pictureType,
    };
  };
};

const analogReadSetup = (block: BlockData): PinSensor => {
  return {
    state: +findFieldValue(block, "state"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const rfidSetup = (block: BlockData): RFIDSensor => {
  return {
    scanned_card: findFieldValue(block, "scanned_card") === "TRUE",
    card_number: findFieldValue(block, "card_number"),
    tag: findFieldValue(block, "tag"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const rfidState = (block: BlockData, timeline): RfidState => {
  const rfidSensor = findSensorState<RFIDSensor>(block, timeline);

  return {
    type: ArduinoComponentType.RFID,
    txPin: findFieldValue(block, "PIN_TX") as ARDUINO_PINS,
    pins: [findFieldValue(block, "PIN_TX") as ARDUINO_PINS],
    scannedCard: rfidSensor.scanned_card,
    cardNumber: rfidSensor.card_number,
    tag: rfidSensor.tag,
  };
};

const tempSetup = (block: BlockData): TempSensor => {
  return {
    temp: +findFieldValue(block, "temp"),
    humidity: +findFieldValue(block, "humidity"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const tempState = (block: BlockData, timeline: Timeline): TemperatureState => {
  const tempSensor = findSensorState<TempSensor>(block, timeline);

  return {
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    temperature: tempSensor.temp,
    humidity: tempSensor.humidity,
  };
};

const timeSetup = (block: BlockData): TimeSensor => {
  return {
    time_in_seconds: +findFieldValue(block, "time_in_seconds"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const timeState = (block: BlockData, timeline: Timeline): TimeState => {
  return {
    type: ArduinoComponentType.TIME,
    pins: [],
    timeInSeconds:
      +timeline.iteration * +findFieldValue(block, "time_in_seconds"),
  };
};

const ultraSonicSensor = (block: BlockData): MotionSensor => {
  return {
    cm: +findFieldValue(block, "cm"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const ultraSonicState = (
  block: BlockData,
  timeline: Timeline
): UltraSonicSensorState => {
  const ultraSensor = findSensorState<MotionSensor>(block, timeline);

  return {
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
    trigPin: findFieldValue(block, "PIN_TRIG") as ARDUINO_PINS,
    echoPin: findFieldValue(block, "PIN_ECHO") as ARDUINO_PINS,
    pins: [
      findFieldValue(block, "PIN_TRIG") as ARDUINO_PINS,
      findFieldValue(block, "PIN_ECHO") as ARDUINO_PINS,
    ],
    cm: ultraSensor.cm,
  };
};

const messageState = (
  block: BlockData,
  timeline: Timeline
): ArduinoReceiveMessageState => {
  // TODO FIX WITH MESSAGE
  const btState = findSensorState<BluetoothSensor>(block, timeline);

  return {
    type: ArduinoComponentType.MESSAGE,
    pins: [],
    hasMessage: btState.receiving_message,
    message: btState.message,
  };
};

const blockToSensorData: { [blockName: string]: RetrieveSensorData } = {
  bluetooth_setup: bluetoothSetupBlockToSensorData,
  button_setup: buttonSetupBlockToSensorData,
  ir_remote_setup: irRemoteSetupBlocktoSensorData,
  digital_read_setup: digitalReadSetup,
  analog_read_setup: analogReadSetup,
  rfid_setup: rfidSetup,
  temp_setup: tempSetup,
  time_setup: timeSetup,
  ultra_sonic_sensor_setup: ultraSonicSensor,
  message_setup: bluetoothSetupBlockToSensorData,
};

const blockToSensorComponent: {
  [blockName: string]: BlockToComponentState;
} = {
  bluetooth_setup: bluetoothSetupBlockToComponentState,
  button_setup: buttonSetupBlockToComponentState,
  ir_remote_setup: irRemoteSetupBlockToComponentState,
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
    throw new Error("No Sensor Data function found for " + block.blockName);
  }

  return blockToSensorComponent[block.blockName](block, timeline);
};

export const convertToSensorData = (block: BlockData): Sensor => {
  if (!_.isFunction(blockToSensorData[block.blockName])) {
    throw new Error("No Sensor Data function found for " + block.blockName);
  }

  return blockToSensorData[block.blockName](block);
};
