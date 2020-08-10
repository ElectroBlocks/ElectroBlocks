import { componentToSvgId, createComponentEl } from './svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import {
  ArduinoComponentState,
  ArduinoComponentType,
} from '../frames/arduino.frame';
import { addDraggableEvent } from './component-events.helpers';
import {
  bluetoothCreate,
  createBluetoothWires,
} from './components/bluetooth.sync';
import { createButton, createWiresButton } from './components/button.sync';
import {
  createIrRemote,
  createWiresIrRemote,
} from './components/ir_remote.sync';
import { createWiresLcd, lcdCreate } from './components/lcd.sync';
import { createWiresRgbLed, createRgbLed } from './components/rgbled.sync';
import {
  ledMatrixCreate,
  createWiresLedMatrix,
} from './components/ledmatrix.sync';
import { arduinoMessageCreate } from './components/arduino-message.sync';
import { motorCreate } from './components/motor.sync';
import {
  neoPixelCreate,
  createWiresNeoPixels,
} from './components/neoPixel.sync';
import {
  createPinComponent,
  createDigitalAnalogWire,
} from './components/pin.component';
import { createRfid, createWiresRfid } from './components/rfid.sync';
import { servoCreate, createWiresServo } from './components/servo.sync';
import { createTemp, createWiresTemp } from './components/temp.sync';
import {
  createUltraSonicSensor,
  createWiresUltraSonicSensor,
} from './components/ultrasonic.sync';
import {
  PinPicture,
  LCDScreenState,
  LedColorState,
  PinState,
} from '../frames/arduino-components.state';

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

export default (
  state: ArduinoComponentState,
  arduinoEl: Element,
  draw: Svg
): void => {
  // Because this connectted to the Arduino
  if (state.type === ArduinoComponentType.MESSAGE) {
    return;
  }

  const id = componentToSvgId(state);
  let componentEl = draw.findOne('#' + id) as Element;
  if (componentEl) {
    return;
  }

  componentEl = createComponentEl(draw, state, getSvgString(state));
  addDraggableEvent(componentEl, arduinoEl, draw);
  (window as any)[state.type] = componentEl;
  createComponentHooks[state.type](state, componentEl, arduinoEl, draw);
  createWires[state.type](state, draw, componentEl, arduinoEl, id);
};

const getSvgString = (state: ArduinoComponentState) => {
  if (state.type === ArduinoComponentType.LCD_SCREEN) {
    return (state as LCDScreenState).rows === 4 ? lcd_20_4_svg : lcd_16_2_svg;
  }

  if (state.type === ArduinoComponentType.LED_COLOR) {
    return (state as LedColorState).pictureType === 'BREADBOARD'
      ? rgbLedBreadboard
      : rgbLedNoResistorSvg;
  }

  if (state.type === ArduinoComponentType.PIN) {
    if ((state as PinState).pinPicture === PinPicture.LED) {
      return ledSvgString.replace(
        /radial-gradient/g,
        `radial-gradient-${(state as PinState).pin}`
      );
    }

    return pinPictureSvgString[(state as PinState).pinPicture];
  }

  if (createSvgString[state.type]) {
    return createSvgString[state.type];
  }

  throw new Error('No Svg String found ' + state.type);
};

export interface CreateComponentHook<T extends ArduinoComponentState> {
  (state: T, componentEl: Element, arduinoEl: Element, draw: Svg): void;
}

export interface CreateWire<T extends ArduinoComponentState> {
  (
    state: T,
    draw: Svg,
    component: Element,
    arduinoEl: Element,
    componentId: string
  ): void;
}

const createNoWires: CreateWire<ArduinoComponentState> = (
  state,
  draw,
  component,
  arduino,
  id
) => {};

const createSvgString = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothSvg,
  [ArduinoComponentType.BUTTON]: buttonSvgString,
  [ArduinoComponentType.IR_REMOTE]: irRemoteSvgString,
  [ArduinoComponentType.LED_MATRIX]: ledmatrixSvgString,
  [ArduinoComponentType.MOTOR]: motorSvgString,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neopixelSvgString,
  [ArduinoComponentType.RFID]: rfidSvgString,
  [ArduinoComponentType.SERVO]: servoSVGText,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: tempSvgString,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: ultraSonicSvgString,
};

const pinPictureSvgString = {
  [PinPicture.SOIL_SENSOR]: soilSensorSvgString,
  [PinPicture.SENSOR]: analogSensorSvgString,
  [PinPicture.PHOTO_SENSOR]: photoSensorSvgString,
  [PinPicture.TOUCH_SENSOR]: touchSensorSvgString,
  [PinPicture.LED_ANALOG_WRITE]: analogdigitalWriteSvgString,
  [PinPicture.LED_DIGITAL_WRITE]: analogdigitalWriteSvgString,
};

const createWires = {
  [ArduinoComponentType.BLUE_TOOTH]: createBluetoothWires,
  [ArduinoComponentType.BUTTON]: createWiresButton,
  [ArduinoComponentType.IR_REMOTE]: createWiresIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: createWiresLcd,
  [ArduinoComponentType.LED_COLOR]: createWiresRgbLed,
  [ArduinoComponentType.LED_MATRIX]: createWiresLedMatrix,
  [ArduinoComponentType.MESSAGE]: createNoWires,
  [ArduinoComponentType.MOTOR]: createNoWires,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: createWiresNeoPixels,
  [ArduinoComponentType.PIN]: createDigitalAnalogWire,
  [ArduinoComponentType.RFID]: createWiresRfid,
  [ArduinoComponentType.SERVO]: createWiresServo,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createWiresTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createWiresUltraSonicSensor,
};

const createComponentHooks = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothCreate,
  [ArduinoComponentType.BUTTON]: createButton,
  [ArduinoComponentType.IR_REMOTE]: createIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdCreate,
  [ArduinoComponentType.LED_COLOR]: createRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixCreate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageCreate,
  [ArduinoComponentType.MOTOR]: motorCreate,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelCreate,
  [ArduinoComponentType.PIN]: createPinComponent,
  [ArduinoComponentType.RFID]: createRfid,
  [ArduinoComponentType.SERVO]: servoCreate,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createUltraSonicSensor,
};
