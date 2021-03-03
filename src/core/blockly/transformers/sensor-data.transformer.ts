import _ from "lodash";

import type { Sensor } from "../dto/sensors.type";
import type { BlockData } from "../dto/block.type";
import type {
  Timeline,
  ArduinoComponentState,
} from "../../frames/arduino.frame";
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
import { temperatureSetupBlockToSensorData } from "../../../blocks/temperature/setupblocktosensordata";
import { temperatureSetupBlockToComponentState } from "../../../blocks/temperature/setupblocktocomponentstate";
import { thermistorSetupBlockToSensorData } from "../../../blocks/thermistor/setupblocktosensordata";
import { thermistorSetupBlockToComponentState } from "../../../blocks/thermistor/setupblocktocomponentstate";

interface RetrieveSensorData {
  (block: BlockData): Sensor;
}

interface BlockToComponentState {
  (block: BlockData, timeline: Timeline): ArduinoComponentState;
}

const blockToSensorData: { [blockName: string]: RetrieveSensorData } = {
  bluetooth_setup: bluetoothSetupBlockToSensorData,
  button_setup: buttonSetupBlockToSensorData,
  ir_remote_setup: irRemoteSetupBlocktoSensorData,
  digital_read_setup: digitalSetupBlockToSensorData,
  analog_read_setup: analogSetupBlockToSensorData,
  rfid_setup: rfidSetupBlockToSensorData,
  temp_setup: temperatureSetupBlockToSensorData,
  time_setup: timeSetupBlockToSensorData,
  ultra_sonic_sensor_setup: ultraSonicSetupBlockToSensorData,
  message_setup: messageSetupBlockToSensorData,
  thermistor_setup: thermistorSetupBlockToSensorData,
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
  temp_setup: temperatureSetupBlockToComponentState,
  time_setup: timeSetupBlockToComponentState,
  ultra_sonic_sensor_setup: ultraSonicSetupBlockToComponentState,
  message_setup: messageSetupBlockToComponentState,
  thermistor_setup: thermistorSetupBlockToComponentState,
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
