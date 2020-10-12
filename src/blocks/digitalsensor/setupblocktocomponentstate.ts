import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { DigitalSensor, DigitalSensorState, DigitalPictureType } from "./state";

export const digitalSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): DigitalSensorState => {
  const digitalSensorState = findSensorState<DigitalSensor>(block, timeline);

  const pin = findFieldValue(block, "PIN") as ARDUINO_PINS;
  return {
    type: ArduinoComponentType.DIGITAL_SENSOR,
    pins: [pin],
    pin,
    pictureType: findFieldValue(block, "TYPE") as DigitalPictureType,
    isOn: digitalSensorState.isOn,
  };
};
