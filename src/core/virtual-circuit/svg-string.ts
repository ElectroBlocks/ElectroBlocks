import {
  ArduinoComponentType,
  ArduinoComponentState,
} from "../frames/arduino.frame";

import analogSensorSvgString from "./svgs/digital_analog_sensor/digital_analog_sensor.svg";
import soilSensorSvgString from "./svgs/soilsensor/soilsensor.svg";
import photoSensorSvgString from "./svgs/photosensor/photosensor.svg";
import touchSensorSvgString from "./svgs/touch-sensor/touch-sensor.svg";
import bluetoothSvg from "../../blocks/bluetooth/bluetooth.svg";
import buttonSvgString from "../../blocks/button/button.svg";
import analogdigitalWriteSvgString from "./svgs/analogdigital/digital_analog_write.svg";
import irRemoteSvgString from "../../blocks/ir_remote/ir_remote.svg";
import ledSvgString from "./svgs/led/led.svg";
import ledmatrixSvgString from "../../blocks/led_matrix/ledmatrix.svg";
import motorSvgString from "./svgs/motor/motor.svg";
import neopixelSvgString from "../../blocks/neopixels/neopixel.svg";
import rfidSvgString from "./svgs/rfid/rfid.svg";
import rgbLedBreadboard from "./svgs/rgbled/rgbled-breadboard.svg";
import rgbLedResistorBuiltIn from "./svgs/rgbled/rgbled-resistorbuiltin.svg";
import servoSVGText from "./svgs/servo/servo.svg";
import tempSvgString from "./svgs/temp/temp-humidity.svg";
import ultraSonicSvgString from "./svgs/ultrasonic-sensor/ultrasonic-sensor.svg";
import {
  PinPicture,
  LedColorState,
  PinState,
} from "../frames/arduino-components.state";
import { getLcdScreenSvgString } from "../../blocks/lcd_screen/svg-string";

export interface GetSvgString {
  (state: ArduinoComponentState | undefined): string;
}

const getLedColorSvgString = (state: LedColorState) => {
  return state.pictureType === "BREADBOARD"
    ? rgbLedBreadboard
    : rgbLedResistorBuiltIn;
};

const getPinSvgString = (state: PinState) => {
  if (state.pinPicture === PinPicture.LED) {
    return ledSvgString.replace(
      /radial-gradient/g,
      `radial-gradient-${(state as PinState).pin}`
    );
  }

  return pinPictureSvgString[(state as PinState).pinPicture];
};

export const getSvgString = (state: ArduinoComponentState) => {
  if (createSvgString[state.type]) {
    return createSvgString[state.type](state);
  }

  throw new Error("No Svg String found " + state.type);
};

const createSvgString: { [key: string]: GetSvgString } = {
  [ArduinoComponentType.BLUE_TOOTH]: (_) => bluetoothSvg,
  [ArduinoComponentType.BUTTON]: (_) => buttonSvgString,
  [ArduinoComponentType.IR_REMOTE]: (_) => irRemoteSvgString,
  [ArduinoComponentType.LED_MATRIX]: (_) => ledmatrixSvgString,
  [ArduinoComponentType.MOTOR]: (_) => motorSvgString,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: (_) => neopixelSvgString,
  [ArduinoComponentType.RFID]: (_) => rfidSvgString,
  [ArduinoComponentType.SERVO]: (_) => servoSVGText,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: (_) => tempSvgString,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: (_) => ultraSonicSvgString,
  [ArduinoComponentType.LCD_SCREEN]: getLcdScreenSvgString,
  [ArduinoComponentType.LED_COLOR]: getLedColorSvgString,
  [ArduinoComponentType.PIN]: getPinSvgString,
};

const pinPictureSvgString = {
  [PinPicture.SOIL_SENSOR]: soilSensorSvgString,
  [PinPicture.SENSOR]: analogSensorSvgString,
  [PinPicture.PHOTO_SENSOR]: photoSensorSvgString,
  [PinPicture.TOUCH_SENSOR]: touchSensorSvgString,
  [PinPicture.LED_ANALOG_WRITE]: analogdigitalWriteSvgString,
  [PinPicture.LED_DIGITAL_WRITE]: analogdigitalWriteSvgString,
};
