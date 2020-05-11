import arduinoSVGText from './svgs/arduino.svg';
import servoSVGText from './svgs/servo.svg';
import { Svg, Element } from '@svgdotjs/svg.js';
import { ArduinoState } from '../frames/state/arduino.state';
import { ARDUINO_UNO_PINS } from '../../constants/arduino';
import { syncComponents } from './svg.component';

export default (draw: Svg, state: ArduinoState = undefined) => {
  const arduino = findOrCreateArduino(draw);

  arduino.node.id = 'arduino_main_svg';
  arduino.find('#MESSAGE')[0].hide();
  arduino.height(draw.height() * 0.7);
  arduino.y(draw.height() * 0.3);
  arduino.cx(draw.width() / 2);
  (window as any).arduino = arduino;
  hideAllWires(arduino);
  if (state) {
    console.log('sync called', state);
    syncComponents(state.components, draw);
  }
};

const findOrCreateArduino = (draw: Svg) => {
  let [arduino] = draw.find('#arduino_main_svg');

  if (arduino) {
    return arduino;
  }

  arduino = draw.svg(arduinoSVGText).first() as Element | Svg;

  //(arduino as any).draggable();
  // (arduino as any).zoom(1);

  return arduino;
};

const hideAllWires = (arduino: Element) => {
  Object.keys(ARDUINO_UNO_PINS)
    .map((key) => arduino.find('#' + key)[0])
    .filter((wire) => wire !== undefined)
    .forEach((wire) => wire.hide());
};
