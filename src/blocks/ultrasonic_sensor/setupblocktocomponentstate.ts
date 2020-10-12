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
