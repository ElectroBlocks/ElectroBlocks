import { ArduinoComponentState, ArduinoFrame } from '../frames/arduino.frame';
import { Svg } from '@svgdotjs/svg.js';
import { servoCreate, servoUpdate } from './components/servo.sync';
import { bluetoothCreate } from './components/bluetooth.sync';
import {
  arduinoMessageUpdate,
  arduinoMessageCreate,
} from './components/arduino-message.sync';

export interface SyncComponent {
  (state: ArduinoComponentState, ArduinoFrame: ArduinoFrame, draw: Svg): void;
}

export interface CreateComponent {
  (state: ArduinoComponentState, frame: ArduinoFrame, draw: Svg): void;
}

const listSyncs = [servoUpdate, arduinoMessageUpdate];
const listCreate = [servoCreate, arduinoMessageCreate, bluetoothCreate];

export const syncComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components.forEach((c) => {
    listSyncs.forEach((s) => s(c, frame, draw));
  });
};

export const createComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components.forEach((c) => {
    listCreate.forEach((lc) => {
      lc(c, frame, draw);
    });
  });
};
