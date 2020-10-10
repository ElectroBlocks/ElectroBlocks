import {
  ArduinoComponentType,
  ArduinoComponentState,
} from "../frames/arduino.frame";

import bluetoothSvg from "../../blocks/bluetooth/bluetooth.svg";
import buttonSvgString from "../../blocks/button/button.svg";
import writePinSvgString from "../../blocks/writepin/writepin.svg";
import irRemoteSvgString from "../../blocks/ir_remote/ir_remote.svg";
import ledmatrixSvgString from "../../blocks/led_matrix/ledmatrix.svg";
import motorSvgString from "../../blocks/motors/motor.svg";
import neopixelSvgString from "../../blocks/neopixels/neopixel.svg";
import rfidSvgString from "../../blocks/rfid/rfid.svg";
import servoSVGText from "../../blocks/servo/servo.svg";
import tempSvgString from "../../blocks/temperature/temp-humidity.svg";
import ultraSonicSvgString from "../../blocks/ultrasonic_sensor/ultrasonic-sensor.svg";
import { getLcdScreenSvgString } from "../../blocks/lcd_screen/svg-string";
import { getLedColorSvgString } from "../../blocks/rgbled/svg-string";
import { getLedSvgString } from "../../blocks/led/svg-string";
import { getDigitalSensorSvg } from "../../blocks/digitalsensor/svg-string";
import { getAnalogSensorSvg } from "../../blocks/analogsensor/svg-string";

export interface GetSvgString {
  (state: ArduinoComponentState | undefined): string;
}

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
  [ArduinoComponentType.DIGITAL_SENSOR]: getDigitalSensorSvg,
  [ArduinoComponentType.LED]: getLedSvgString,
  [ArduinoComponentType.WRITE_PIN]: (_) => writePinSvgString,
  [ArduinoComponentType.ANALOG_SENSOR]: getAnalogSensorSvg,
};
