import { ArduinoComponentState, ArduinoFrame } from '../frames/arduino.frame';
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

export interface SyncComponent {
  (state: ArduinoComponentState, ArduinoFrame: ArduinoFrame, draw: Svg): void;
}

export interface ResetComponent {
  (componentEl: Element): void;
}

export interface CreateComponent {
  (
    state: ArduinoComponentState,
    frame: ArduinoFrame,
    draw: Svg,
    showArduino: boolean
  ): void;
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
const listCreate = [
  servoCreate,
  arduinoMessageCreate,
  bluetoothCreate,
  lcdCreate,
  createRgbLed,
  ledCreate,
  digitalAnanlogWritePinCreate,
];

const resetComponent = [servoReset, resetLed, digitalAnalogWritePinReset];

export const syncComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components.forEach((componentState) => {
    listSyncs.forEach((func) => func(componentState, frame, draw));
  });
  const componentIds = frame.components.map((c) => componentToSvgId(c));
  console.log(componentIds, 'componentIds');
  draw
    .find('.component')
    .filter((componentEl) => !componentIds.includes(componentEl.id()))
    .forEach((componentEl) => {
      resetComponent.forEach((func) => func(componentEl));
    });
};

export const createComponents = (
  frame: ArduinoFrame,
  draw: Svg,
  showArduino: boolean
) => {
  frame.components.forEach((componentState) => {
    listCreate.forEach((func) => {
      func(componentState, frame, draw, showArduino);
    });
  });
};
