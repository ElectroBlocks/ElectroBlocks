import { DigitalPictureType, DigitalSensorState } from "./state";
import touchSVGString from "./art/touch-sensor.svg?raw";
import digitalSensorSvg from "./art/digital_sensor.svg?raw";

export const getDigitalSensorSvg = (state: DigitalSensorState) => {
  return state.pictureType === DigitalPictureType.TOUCH_SENSOR
    ? touchSVGString
    : digitalSensorSvg;
};
