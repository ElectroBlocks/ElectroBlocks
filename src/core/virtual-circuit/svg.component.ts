import { ArduinoComponentState } from '../frames/state/arduino.state';
import { Svg } from '@svgdotjs/svg.js';
import { servoCreate, servoUpdate } from './components/servo-svg';

export interface SyncComponent {
  (state: ArduinoComponentState, draw: Svg): void;
}

export interface CreateComponent {
  (state: ArduinoComponentState, draw: Svg): void;
}

const listSyncs = [servoUpdate];
const listCreate = [servoCreate];

export const syncComponents = (
  components: ArduinoComponentState[],
  draw: Svg
) => {
  components.forEach((c) => {
    listSyncs.forEach((s) => s(c, draw));
  });
};

export const createComponents = (
  components: ArduinoComponentState[],
  draw: Svg
) => {
  components.forEach((c) => {
    listCreate.forEach((lc) => lc(c, draw));
  });
};
