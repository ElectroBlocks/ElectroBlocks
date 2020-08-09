import {
  ArduinoComponentState,
  ArduinoFrame,
  ArduinoComponentType,
} from '../frames/arduino.frame';
import { Svg, Element } from '@svgdotjs/svg.js';
import { servoCreate, servoUpdate, servoReset } from './components/servo.sync';
import {
  bluetoothCreate,
  bluetoothUpdate,
  bluetoothReset,
} from './components/bluetooth.sync';
import {
  arduinoMessageUpdate,
  arduinoMessageCreate,
  resetArduinoMessage,
} from './components/arduino-message.sync';
import { lcdCreate, lcdUpdate, lcdReset } from './components/lcd.sync';
import { componentToSvgId } from './svg-helpers';
import {
  updateRgbLed,
  createRgbLed,
  resetRgbLed,
} from './components/rgbled.sync';
import {
  createPinComponent,
  resetPinComponent,
  updatePinComponent,
} from './components/pin.component';
import _ from 'lodash';
import {
  neoPixelCreate,
  neoPixelUpdate,
  neoPixelReset,
} from './components/neoPixel.sync';
import {
  ledMatrixCreate,
  ledMatrixUpdate,
  ledMatrixReset,
} from './components/ledmatrix.sync';
import { motorCreate, motorUpdate, motorReset } from './components/motor.sync';
import {
  updateButton,
  createButton,
  resetButton,
} from './components/button.sync';
import {
  createIrRemote,
  updateIrRemote,
  resetIrRemote,
} from './components/ir_remote.sync';
import {
  createUltraSonicSensor,
  updateUltraSonicSensor,
  resetUltraSonicSensor,
} from './components/ultrasonic.sync';
import { updateRfid, createRfid, resetRfid } from './components/rfid.sync';
import { updateTemp, createTemp, resetTemp } from './components/temp.sync';

export interface SyncComponent {
  (state: ArduinoComponentState, ArduinoFrame: ArduinoFrame, draw: Svg): void;
}

export interface ResetComponent {
  (componentEl: Element): void;
}

export interface CreateComponent {
  (state: ArduinoComponentState, frame: ArduinoFrame, draw: Svg): void;
}

const syncComponent = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothUpdate,
  [ArduinoComponentType.BUTTON]: updateButton,
  [ArduinoComponentType.IR_REMOTE]: updateIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdUpdate,
  [ArduinoComponentType.LED_COLOR]: updateRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixUpdate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageUpdate,
  [ArduinoComponentType.MOTOR]: motorUpdate,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelUpdate,
  [ArduinoComponentType.PIN]: updatePinComponent,
  [ArduinoComponentType.RFID]: updateRfid,
  [ArduinoComponentType.SERVO]: servoUpdate,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: updateTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: updateUltraSonicSensor,
};

const createComponent = {
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

const resetComponent = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothReset,
  [ArduinoComponentType.BUTTON]: resetButton,
  [ArduinoComponentType.IR_REMOTE]: resetIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdReset,
  [ArduinoComponentType.LED_COLOR]: resetRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixReset,
  [ArduinoComponentType.MESSAGE]: resetArduinoMessage,
  [ArduinoComponentType.MOTOR]: motorReset,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelReset,
  [ArduinoComponentType.PIN]: resetPinComponent,
  [ArduinoComponentType.RFID]: resetRfid,
  [ArduinoComponentType.SERVO]: servoReset,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: resetTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: resetUltraSonicSensor,
};

export const createComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components
    .filter((state) => _.isFunction(createComponent[state.type]))
    .map((state) => [state, createComponent[state.type]])
    .forEach(([state, func]: [ArduinoComponentState, CreateComponent]) =>
      func(state, frame, draw)
    );
};

export const syncComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components
    .filter((state) => _.isFunction(syncComponent[state.type]))
    .map((state) => [state, syncComponent[state.type]])
    .forEach(([state, func]: [ArduinoComponentState, SyncComponent]) =>
      func(state, frame, draw)
    );

  // Reset all components elements that don't have state in the frame
  const componentIds = frame.components.map((c) => componentToSvgId(c));

  draw
    .find('.component')
    .filter((componentEl) => !componentIds.includes(componentEl.id()))
    .filter((componentEl) =>
      _.isFunction(resetComponent[componentEl.data('component-type')])
    )
    .map((componentEl) => [
      componentEl,
      resetComponent[componentEl.data('component-type')],
    ])
    .forEach(([componentEl, func]: [Element, ResetComponent]) =>
      func(componentEl)
    );
};
