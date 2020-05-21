import arduinoSVGText from './svgs/arduino.svg';
import servoSVGText from './svgs/servo.svg';
import { Svg, Element } from '@svgdotjs/svg.js';
import { ArduinoState } from '../frames/state/arduino.state';
import { ARDUINO_UNO_PINS } from '../../constants/arduino';
import { syncComponents } from './svg.component';
import { resetBreadBoardWholes } from './wire';

export default (draw: Svg, state: ArduinoState = undefined) => {
  const arduino = findOrCreateArduino(draw);

  arduino.node.id = 'arduino_main_svg';
  arduino.find('#MESSAGE')[0].hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  (window as any).arduinoText = arduinoSVGText;
  arduino.cx(draw.cx());
  (draw as any).zoom((0.5 / 650) * draw.width());

  resetBreadBoardWholes();
  hideAllWires(arduino);
  if (state) {
    syncComponents(state.components, draw);
    state.components
      .flatMap((b) => b.pins)
      .forEach((wire) => showWire(arduino, wire));
  }

  arduino.y(draw.viewbox().y2 - arduino.height());
  (draw as any).zoom((0.5 / 650) * draw.width());
};

const findOrCreateArduino = (draw: Svg) => {
  let [arduino] = draw.find('#arduino_main_svg');

  if (arduino) {
    return arduino;
  }

  arduino = draw.svg(arduinoSVGText).first() as Element | Svg;

  return arduino;
};

const hideAllWires = (arduino: Element) => {
  Object.keys(ARDUINO_UNO_PINS)
    .map((key) => arduino.find('#' + key)[0])
    .filter((wire) => wire !== undefined)
    .forEach((wire) => wire.hide());
};

const showWire = (arduino: Element, wire: string) => {
  arduino.findOne('#PIN_' + wire).show();
};
