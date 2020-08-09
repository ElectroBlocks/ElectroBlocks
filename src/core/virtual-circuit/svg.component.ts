import {
  ArduinoComponentState,
  ArduinoFrame,
  ArduinoComponentType,
} from '../frames/arduino.frame';
import { Svg, Element } from '@svgdotjs/svg.js';
import { servoCreate, servoUpdate, servoReset } from './components/servo.sync';
import { bluetoothCreate, bluetoothUpdate } from './components/bluetooth.sync';
import {
  arduinoMessageUpdate,
  arduinoMessageCreate,
} from './components/arduino-message.sync';
import { lcdCreate, lcdUpdate } from './components/lcd.sync';
import { componentToSvgId } from './svg-helpers';
import { updateRgbLed, createRgbLed } from './components/rgbled.sync';
import {
  createPinComponent,
  resetPinComponent,
  updatePinComponent,
} from './components/pin.component';
import _ from 'lodash';
import { neoPixelCreate, neoPixelUpdate } from './components/neoPixel.sync';
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
import { createIrRemote, updateIrRemote } from './components/ir_remote.sync';
import { createUltraSonicSensor } from './components/ultrasonic.sync';
import { updateRfid, createRfid } from './components/rfid.sync';
import { updateTemp, createTemp } from './components/temp.sync';

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
  [ArduinoComponentType.SERVO]: servoUpdate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageUpdate,
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothUpdate,
  [ArduinoComponentType.LCD_SCREEN]: lcdUpdate,
  [ArduinoComponentType.LED_COLOR]: updateRgbLed,
  [ArduinoComponentType.PIN]: updatePinComponent,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelUpdate,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixUpdate,
  [ArduinoComponentType.MOTOR]: motorUpdate,
  [ArduinoComponentType.BUTTON]: updateButton,
  [ArduinoComponentType.IR_REMOTE]: updateIrRemote,
  [ArduinoComponentType.RFID]: updateRfid,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: updateTemp,
};

const createComponent = {
  [ArduinoComponentType.SERVO]: servoCreate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageCreate,
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothCreate,
  [ArduinoComponentType.LCD_SCREEN]: lcdCreate,
  [ArduinoComponentType.LED_COLOR]: createRgbLed,
  [ArduinoComponentType.PIN]: createPinComponent,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelCreate,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixCreate,
  [ArduinoComponentType.MOTOR]: motorCreate,
  [ArduinoComponentType.BUTTON]: createButton,
  [ArduinoComponentType.IR_REMOTE]: createIrRemote,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createUltraSonicSensor,
  [ArduinoComponentType.RFID]: createRfid,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createTemp,
};

const resetComponent = {
  [ArduinoComponentType.SERVO]: servoReset,
  [ArduinoComponentType.PIN]: resetPinComponent,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixReset,
  [ArduinoComponentType.MOTOR]: motorReset,
  [ArduinoComponentType.BUTTON]: resetButton,
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
    .forEach(([componentEl, func]: [Element, ResetComponent]) => {
      func(componentEl);
    });
};
