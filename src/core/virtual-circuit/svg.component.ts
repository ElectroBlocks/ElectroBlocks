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
import { ledCreate, updateLed, resetLed } from './components/led.sync';
import {
  digitalAnanlogWritePinCreate,
  digitalAnalogWritePinSync,
  digitalAnalogWritePinReset,
} from './components/digitalanalogwritepin.sync';
import {
  createPinComponent,
  resetPinComponent,
  updatePinComponent,
} from './components/pin.component';
import _ from 'lodash';

export interface SyncComponent {
  (state: ArduinoComponentState, ArduinoFrame: ArduinoFrame, draw: Svg): void;
}

export interface ResetComponent {
  (componentEl: Element): void;
}

export interface CreateComponent {
  (state: ArduinoComponentState, frame: ArduinoFrame, draw: Svg): void;
}

const listSyncs = [
  servoUpdate,
  arduinoMessageUpdate,
  bluetoothUpdate,
  lcdUpdate,
  updateRgbLed,
  updateLed,
  digitalAnalogWritePinSync,
];

const syncComponent = {
  [ArduinoComponentType.SERVO]: servoUpdate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageUpdate,
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothUpdate,
  [ArduinoComponentType.LCD_SCREEN]: lcdUpdate,
  [ArduinoComponentType.LED_COLOR]: updateRgbLed,
  [ArduinoComponentType.PIN]: updatePinComponent,
};

const createComponent = {
  [ArduinoComponentType.SERVO]: servoCreate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageCreate,
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothCreate,
  [ArduinoComponentType.LCD_SCREEN]: lcdCreate,
  [ArduinoComponentType.LED_COLOR]: createRgbLed,
  [ArduinoComponentType.PIN]: createPinComponent,
};

const resetComponent = {
  [ArduinoComponentType.SERVO]: servoReset,
  [ArduinoComponentType.PIN]: resetPinComponent,
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
    .filter((state) => _.isFunction(resetComponent[state.type]))
    .map((state) => [state, resetComponent[state.type]])
    .forEach(([state, func]: [ArduinoComponentState, CreateComponent]) =>
      func(state, frame, draw)
    );
};
