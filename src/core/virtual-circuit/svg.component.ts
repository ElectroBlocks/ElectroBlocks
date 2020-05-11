import { ArduinoComponentState } from '../frames/state/arduino.state';
import { Svg } from '@svgdotjs/svg.js';
import { servoSync } from './components/servo-svg';

export interface SyncComponent {
  (state: ArduinoComponentState, draw: Svg): void;
}

const listSyncs = [servoSync];

export const syncComponents = (
  components: ArduinoComponentState[],
  draw: Svg
) => {
  components.forEach((c) => {
    listSyncs.forEach((s) => s(c, draw));
  });
};
