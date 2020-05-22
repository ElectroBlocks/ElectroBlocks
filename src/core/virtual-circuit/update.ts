import { Svg } from '@svgdotjs/svg.js';
import { ArduinoState } from '../frames/state/arduino.state';
import { syncComponents } from './svg.component';

export default (draw: Svg, state: ArduinoState = undefined) => {
  if (!state) {
    return;
  }

  if (state) {
    syncComponents(state.components, draw);
  }
};
