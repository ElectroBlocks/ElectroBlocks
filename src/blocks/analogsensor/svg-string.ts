import { AnalogSensorPicture, AnalogSensorState } from "./state";
import sensorSvgString from "./art/analog_sensor.svg";
import photoSensorSvgString from "./art/photosensor.svg";
import soilSensorSvgString from "./art/soilsensor.svg";

export const getAnalogSensorSvg = (state: AnalogSensorState) => {
  switch (state.pictureType) {
    case AnalogSensorPicture.PHOTO_SENSOR:
      return photoSensorSvgString;
    case AnalogSensorPicture.SOIL_SENSOR:
      return soilSensorSvgString;
    default:
      return sensorSvgString;
  }
};
