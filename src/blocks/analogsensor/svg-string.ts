import { AnalogSensorPicture, AnalogSensorState } from "./state";
import sensorSvgString from "./art/analog_sensor.svg?raw";
import photoSensorSvgString from "./art/photosensor.svg?raw";
import soilSensorSvgString from "./art/soilsensor.svg?raw";
import potentiometerSvgString from "./art/potentiometer.svg?raw";

export const getAnalogSensorSvg = (state: AnalogSensorState) => {
  switch (state.pictureType) {
    case AnalogSensorPicture.PHOTO_SENSOR:
      return photoSensorSvgString;
    case AnalogSensorPicture.SOIL_SENSOR:
      return soilSensorSvgString;
    case AnalogSensorPicture.POTENTIOMETER:
      return potentiometerSvgString;
    default:
      return sensorSvgString;
  }
};
