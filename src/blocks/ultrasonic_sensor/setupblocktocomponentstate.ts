import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { UltraSonicSensor, UltraSonicSensorState } from "./state";

export const ultraSonicSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): UltraSonicSensorState => {
  const ultraSensor = findSensorState<UltraSonicSensor>(block, timeline);
  const echoPin = findFieldValue(block, "PIN_ECHO");
  const trigPin = findFieldValue(block, "PIN_TRIG");

  return {
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
    trigPin,
    echoPin,
    pins: [
      findFieldValue(block, "PIN_TRIG") as ARDUINO_PINS,
      findFieldValue(block, "PIN_ECHO") as ARDUINO_PINS,
    ],
    setupCommand: `config:m=${echoPin},${trigPin}`,
    cm: ultraSensor.cm,
  };
};

export const utraSonicStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
) => {
  const setupBlock = blocks.find(
    (b) => b.blockName == "ultra_sonic_sensor_setup"
  );
  const [_, pinStr, state] = sensorStr.split(":");
  const echoPin = findFieldValue(setupBlock, "PIN_ECHO");
  const trigPin = findFieldValue(setupBlock, "PIN_TRIG");

  return {
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
    trigPin,
    echoPin,
    pins: [
      findFieldValue(setupBlock, "PIN_TRIG") as ARDUINO_PINS,
      findFieldValue(setupBlock, "PIN_ECHO") as ARDUINO_PINS,
    ],
    setupCommand: `config:m=${echoPin},${trigPin}`,
    cm: state,
  };
};