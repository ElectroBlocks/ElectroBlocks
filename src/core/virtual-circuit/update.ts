import { Svg } from '@svgdotjs/svg.js';
import { ArduinoFrame } from '../frames/arduino.frame';
import { syncComponents } from './svg.component';

export default (draw: Svg, state: ArduinoFrame = undefined) => {
  if (!state) {
    return;
  }

  if (state) {
    syncComponents(state.components, draw);
  }
};
