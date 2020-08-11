import {
  ArduinoComponentType,
  ArduinoComponentState,
} from '../frames/arduino.frame';

import analogSensorSvgString from './svgs/digital_analog_sensor/digital_analog_sensor.svg';
import soilSensorSvgString from './svgs/soilsensor/soilsensor.svg';
import photoSensorSvgString from './svgs/photosensor/photosensor.svg';
import touchSensorSvgString from './svgs/touch-sensor/touch-sensor.svg';
import bluetoothSvg from './svgs/bluetooth/bluetooth.svg';
import buttonSvgString from './svgs/button/button.svg';
import analogdigitalWriteSvgString from './svgs/analogdigital/digital_analog_write.svg';
import irRemoteSvgString from './svgs/ir_remote/ir_remote.svg';
import lcd_16_2_svg from './svgs/lcd/lcd_16_2.svg';
import lcd_20_4_svg from './svgs/lcd/lcd_20_4.svg';
import ledSvgString from './svgs/led/led.svg';
import ledmatrixSvgString from './svgs/ledmatrix/ledmatrix.svg';
import motorSvgString from './svgs/motor/motor.svg';
import neopixelSvgString from './svgs/neopixel/neopixel.svg';
import rfidSvgString from './svgs/rfid/rfid.svg';
import rgbLedBreadboard from './svgs/rgbled/rgbled.svg';
import rgbLedNoResistorSvg from './svgs/rgbled/rgbled-no-resistor.svg';
import servoSVGText from './svgs/servo/servo.svg';
import tempSvgString from './svgs/temp/temp-humidity.svg';
import ultraSonicSvgString from './svgs/ultrasonic-sensor/ultrasonic-sensor.svg';
import {
  PinPicture,
  LCDScreenState,
  LedColorState,
  PinState,
} from '../frames/arduino-components.state';

export interface GetSvgString {
  (state: ArduinoComponentState | undefined): string;
}

const getLedColorSvgString = (state: LedColorState) => {
  return state.pictureType === 'BREADBOARD'
    ? rgbLedBreadboard
    : rgbLedNoResistorSvg;
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

const getLcdScreenSvgString = (state: LCDScreenState) => {
  return state.rows === 4 ? lcd_20_4_svg : lcd_16_2_svg;
};

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
