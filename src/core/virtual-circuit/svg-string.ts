import {
  ArduinoComponentType,
  ArduinoComponentState,
} from "../frames/arduino.frame";

import bluetoothSvg from "../../blocks/bluetooth/bluetooth.svg?raw";
import buttonSvgString from "../../blocks/button/button.svg?raw";
import writePinSvgString from "../../blocks/writepin/writepin.svg?raw";
import irRemoteSvgString from "../../blocks/ir_remote/ir_remote.svg?raw";
import ledmatrixSvgString from "../../blocks/led_matrix/ledmatrix.svg?raw";
import ledSvgString from "../../blocks/led/led.svg?raw";

import thermistorSvgString from "../../blocks/thermistor/thermistor.svg?raw";
import passiveBuzzerSvgString from "../../blocks/passivebuzzer/passivebuzzer.svg?raw";

import motorSvgString from "../../blocks/motors/motor.svg?raw";
import neopixelSvgString from "../../blocks/neopixels/neopixel.svg?raw";
import fastledSvgString from "../../blocks/fastled/fastled-new.svg?raw";
import fastledSvgString24 from "../../blocks/fastled/fastled-new-24.svg?raw";
import fastledSvgString60 from "../../blocks/fastled/fastled-new-60.svg?raw";
import fastledSvgString96 from "../../blocks/fastled/fastled-new-96.svg?raw";
import rfidSvgString from "../../blocks/rfid/rfid.svg?raw";
import servoSVGText from "../../blocks/servo/servo.svg?raw";
import tempSvgString from "../../blocks/temperature/temp-humidity.svg?raw";
import ultraSonicSvgString from "../../blocks/ultrasonic_sensor/ultrasonic-sensor.svg?raw";
import { getLcdScreenSvgString } from "../../blocks/lcd_screen/svg-string";
import { getLedColorSvgString } from "../../blocks/rgbled/svg-string";
import { getDigitalSensorSvg } from "../../blocks/digitalsensor/svg-string";
import { getAnalogSensorSvg } from "../../blocks/analogsensor/svg-string";
import stepperMotorSvg from "../../blocks/steppermotor/steppermotor.svg?raw";
import digitalDisplaySvg from "../../blocks/digit4display/digitdisplay.svg?raw";
import joyStickSvg from "../../blocks/joystick/joystick.svg?raw";
import { FastLEDState } from "../../blocks/fastled/state";

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
  [ArduinoComponentType.FASTLED_STRIP]: (state: FastLEDState) => {
    if (state.numberOfLeds < 25) {
      return fastledSvgString24;
    } else if (state.numberOfLeds < 61) {
      return fastledSvgString60;
    } else if (state.numberOfLeds < 96) {
      return fastledSvgString96;
    } else {
      return fastledSvgString;
    }
  },
  [ArduinoComponentType.RFID]: (_) => rfidSvgString,
  [ArduinoComponentType.SERVO]: (_) => servoSVGText,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: (_) => tempSvgString,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: (_) => ultraSonicSvgString,
  [ArduinoComponentType.LCD_SCREEN]: getLcdScreenSvgString,
  [ArduinoComponentType.LED_COLOR]: getLedColorSvgString,
  [ArduinoComponentType.DIGITAL_SENSOR]: getDigitalSensorSvg,
  [ArduinoComponentType.LED]: () => ledSvgString,
  [ArduinoComponentType.WRITE_PIN]: (_) => writePinSvgString,
  [ArduinoComponentType.ANALOG_SENSOR]: getAnalogSensorSvg,
  [ArduinoComponentType.THERMISTOR]: (_) => thermistorSvgString,
  [ArduinoComponentType.PASSIVE_BUZZER]: (_) => passiveBuzzerSvgString,
  [ArduinoComponentType.STEPPER_MOTOR]: (_) => stepperMotorSvg,
  [ArduinoComponentType.DIGITAL_DISPLAY]: (_) => digitalDisplaySvg,
  [ArduinoComponentType.JOYSTICK]: (_) => joyStickSvg,
};
