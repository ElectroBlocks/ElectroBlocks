import { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { AnalogSensorPicture, AnalogSensorState, AnalogSensor } from "./state";

export const analogSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): AnalogSensorState => {
  const analogSensorState = findSensorState<AnalogSensor>(block, timeline);

  const pin = findFieldValue(block, "PIN") as ARDUINO_PINS;
  return {
    type: ArduinoComponentType.ANALOG_SENSOR,
    pins: [pin],
    pin,
    pictureType: findFieldValue(block, "TYPE") as AnalogSensorPicture,
    state: analogSensorState.state,
  };
};
