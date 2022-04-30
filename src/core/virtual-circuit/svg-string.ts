import {
  ArduinoComponentType,
  ArduinoComponentState,
} from '../frames/arduino.frame';

import bluetoothSvg from '../../blocks/bluetooth/bluetooth.svg';
import buttonSvgString from '../../blocks/button/button.svg';
import writePinSvgString from '../../blocks/writepin/writepin.svg';
import irRemoteSvgString from '../../blocks/ir_remote/ir_remote.svg';
import ledmatrixSvgString from '../../blocks/led_matrix/ledmatrix.svg';

import thermistorSvgString from '../../blocks/thermistor/thermistor.svg';
import passiveBuzzerSvgString from '../../blocks/passivebuzzer/passivebuzzer.svg';

import motorSvgString from '../../blocks/motors/motor.svg';
import neopixelSvgString from '../../blocks/neopixels/neopixel.svg';
import fastledSvgString from '../../blocks/fastled/fastled-new.svg';
import fastledSvgString24 from '../../blocks/fastled/fastled-new-24.svg';
import fastledSvgString60 from '../../blocks/fastled/fastled-new-60.svg';
import fastledSvgString96 from '../../blocks/fastled/fastled-new-96.svg';
import rfidSvgString from '../../blocks/rfid/rfid.svg';
import servoSVGText from '../../blocks/servo/servo.svg';
import tempSvgString from '../../blocks/temperature/temp-humidity.svg';
import ultraSonicSvgString from '../../blocks/ultrasonic_sensor/ultrasonic-sensor.svg';
import { getLcdScreenSvgString } from '../../blocks/lcd_screen/svg-string';
import { getLedColorSvgString } from '../../blocks/rgbled/svg-string';
import { getLedSvgString } from '../../blocks/led/svg-string';
import { getDigitalSensorSvg } from '../../blocks/digitalsensor/svg-string';
import { getAnalogSensorSvg } from '../../blocks/analogsensor/svg-string';
import stepperMotorSvg from '../../blocks/steppermotor/steppermotor.svg';
import digitalDisplaySvg from '../../blocks/digit4display/digitdisplay.svg';
import joyStickSvg from '../../blocks/joystick/joystick.svg';
import { FastLEDState } from '../../blocks/fastled/state';

export interface GetSvgString {
  (state: ArduinoComponentState | undefined): string;
}

export const getSvgString = (state: ArduinoComponentState) => {
  if (createSvgString[state.type]) {
    return createSvgString[state.type](state);
  }

  throw new Error('No Svg String found ' + state.type);
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
  [ArduinoComponentType.LED]: getLedSvgString,
  [ArduinoComponentType.WRITE_PIN]: (_) => writePinSvgString,
  [ArduinoComponentType.ANALOG_SENSOR]: getAnalogSensorSvg,
  [ArduinoComponentType.THERMISTOR]: (_) => thermistorSvgString,
  [ArduinoComponentType.PASSIVE_BUZZER]: (_) => passiveBuzzerSvgString,
  [ArduinoComponentType.STEPPER_MOTOR]: (_) => stepperMotorSvg,
  [ArduinoComponentType.DIGITAL_DISPLAY]: (_) => digitalDisplaySvg,
  [ArduinoComponentType.JOYSTICK]: (_) => joyStickSvg,
};
