import { DigitalPictureType, DigitalSensorState } from "./state";
import touchSVGString from "./touch-sensor.svg";
import digitalSensorSvg from "./digital_sensor.svg";

export const getDigitalSensorSvg = (state: DigitalSensorState) => {
  return state.pictureType === DigitalPictureType.TOUCH_SENSOR
    ? touchSVGString
    : digitalSensorSvg;
};
