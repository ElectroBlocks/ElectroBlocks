import { Svg } from '@svgdotjs/svg.js';
import { ArduinoFrame } from '../frames/arduino.frame';
import { syncComponents } from './svg.component';
import { findSvgElement, LED_COLORS } from './svg-helpers';

export default (draw: Svg, frame: ArduinoFrame = undefined) => {
  if (!frame) {
    return;
  }

  if (frame) {
    syncComponents(frame, draw);
  }
  const arduino = findSvgElement('arduino_main_svg', draw);
  // BUILT IN LED ID BELOW
  // TODO BUILT IN LED
  findSvgElement('TX_LED', arduino as Svg).fill(
    frame.sendMessage.length > 0 ? LED_COLORS.LED_ON : LED_COLORS.LED_OFF
  );

  findSvgElement('BUILT_IN_LED', arduino as Svg).fill(
    frame.builtInLedOn ? LED_COLORS.LED_ON : LED_COLORS.LED_OFF
  );
};
