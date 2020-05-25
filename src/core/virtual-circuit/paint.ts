import arduinoSVGText from './svgs/arduino.svg';
import servoSVGText from './svgs/servo.svg';
import { Svg, Element } from '@svgdotjs/svg.js';
import { ArduinoFrame } from '../frames/arduino.frame';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';
import { syncComponents, createComponents } from './svg.component';
import { resetBreadBoardWholes } from './wire';
import { componentToSvgId } from './svg-helpers';

export default (draw: Svg, state: ArduinoFrame = undefined) => {
  const arduino = findOrCreateArduino(draw);

  arduino.node.id = 'arduino_main_svg';
  arduino.findOne('#MESSAGE').hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  (window as any).arduinoText = arduinoSVGText;
  arduino.cx(draw.cx());
  (draw as any).zoom((0.5 / 650) * draw.width());
  resetBreadBoardWholes();
  hideAllWires(arduino);
  console.log(state, 'did state exist');
  if (state) {
    createComponents(state, draw);
    state.components
      .flatMap((b) => b.pins)
      .forEach((wire) => showWire(arduino, wire));
  }

  draw.find('.component').forEach((c: Element) => {
    const componentId = c.attr('id');
    if (!state) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
      console.log('removed');
      return;
    }

    if (
      state.components.filter((c) => componentId === componentToSvgId(c))
        .length === 0
    ) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
    }
  });

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
