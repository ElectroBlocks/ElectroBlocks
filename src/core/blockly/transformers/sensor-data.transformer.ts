import _ from "lodash";

import { Sensor, TempSensor } from "../dto/sensors.type";
import { BlockData } from "../dto/block.type";
import { findFieldValue } from "../helpers/block-data.helper";
import {
  Timeline,
  ArduinoComponentState,
  ArduinoComponentType,
} from "../../frames/arduino.frame";
import { TemperatureState } from "../../frames/arduino-components.state";
import { ARDUINO_PINS } from "../../microcontroller/selectBoard";
import { findSensorState } from "../helpers/sensor_block.helper";
import { bluetoothSetupBlockToSensorData } from "../../../blocks/bluetooth/setupblocktosensordata";
import { buttonSetupBlockToSensorData } from "../../../blocks/button/setupblocktosensordata";
import { bluetoothSetupBlockToComponentState } from "../../../blocks/bluetooth/setupblocktocomponentstate";
import { buttonSetupBlockToComponentState } from "../../../blocks/button/setupblocktocomponentstate";
import { irRemoteSetupBlocktoSensorData } from "../../../blocks/ir_remote/setupblocktosensordata";
import { irRemoteSetupBlockToComponentState } from "../../../blocks/ir_remote/setupblocktocomponentstate";
import { digitalSetupBlockToComponentState } from "../../../blocks/digitalsensor/setupblocktocomponentstate";
import { digitalSetupBlockToSensorData } from "../../../blocks/digitalsensor/setupblocktosensordata";
import { analogSetupBlockToComponentState } from "../../../blocks/analogsensor/setupblocktocomponentstate";
import { analogSetupBlockToSensorData } from "../../../blocks/analogsensor/setupblocktosensordata";
import { messageSetupBlockToComponentState } from "../../../blocks/message/setupblocktocomponentstate";
import { messageSetupBlockToSensorData } from "../../../blocks/message/setupblocktosensordata";
import { timeSetupBlockToSensorData } from "../../../blocks/time/setupblocktosensordata";
import { timeSetupBlockToComponentState } from "../../../blocks/time/setupblocktocomponentstate";
import { ultraSonicSetupBlockToSensorData } from "../../../blocks/ultrasonic_sensor/setupblocktosensordata";
import { ultraSonicSetupBlockToComponentState } from "../../../blocks/ultrasonic_sensor/setupblocktocomponentstate";
import { rfidSetupBlockToSensorData } from "../../../blocks/rfid/setupblocktosensordata";
import { rfidSetupBlockToComponentState } from "../../../blocks/rfid/setupblocktocomponentstate";

interface RetrieveSensorData {
  (block: BlockData): Sensor;
}

interface BlockToComponentState {
  (block: BlockData, timeline: Timeline): ArduinoComponentState;
}

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

const blockToSensorData: { [blockName: string]: RetrieveSensorData } = {
  bluetooth_setup: bluetoothSetupBlockToSensorData,
  button_setup: buttonSetupBlockToSensorData,
  ir_remote_setup: irRemoteSetupBlocktoSensorData,
  digital_read_setup: digitalSetupBlockToSensorData,
  analog_read_setup: analogSetupBlockToSensorData,
  rfid_setup: rfidSetupBlockToSensorData,
  temp_setup: tempSetup,
  time_setup: timeSetupBlockToSensorData,
  ultra_sonic_sensor_setup: ultraSonicSetupBlockToSensorData,
  message_setup: messageSetupBlockToSensorData,
};

const blockToSensorComponent: {
  [blockName: string]: BlockToComponentState;
} = {
  bluetooth_setup: bluetoothSetupBlockToComponentState,
  button_setup: buttonSetupBlockToComponentState,
  ir_remote_setup: irRemoteSetupBlockToComponentState,
  digital_read_setup: digitalSetupBlockToComponentState,
  analog_read_setup: analogSetupBlockToComponentState,
  rfid_setup: rfidSetupBlockToComponentState,
  temp_setup: tempState,
  time_setup: timeSetupBlockToComponentState,
  ultra_sonic_sensor_setup: ultraSonicSetupBlockToComponentState,
  message_setup: messageSetupBlockToComponentState,
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
