import { Svg } from '@svgdotjs/svg.js';
import { ArduinoFrame } from '../frames/arduino.frame';
import { syncComponents } from './svg.component';
import { findSvgElement, LED_COLORS } from './svg-helpers';

export default (draw: Svg, state: ArduinoFrame = undefined) => {
  if (!state) {
    return;
  }

  if (state) {
    syncComponents(state, draw);
  }
  const arduino = findSvgElement('arduino_main_svg', draw);
  // BUILT IN LED ID BELOW
  // TODO BUILT IN LED
};
