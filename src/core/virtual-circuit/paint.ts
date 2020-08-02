import arduinoSVGText from './svgs/arduino.svg';
import { Svg, Element } from '@svgdotjs/svg.js';
import { ArduinoFrame } from '../frames/arduino.frame';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';
import { createComponents } from './svg.component';
import { resetBreadBoardWholes } from './wire';
import { componentToSvgId, findArduinoEl } from './svg-helpers';

export default (draw: Svg, frame: ArduinoFrame = undefined) => {
  const arduino = findOrCreateArduino(draw);

  resetBreadBoardWholes();
  hideAllWires(arduino);

  if (frame) {
    createComponents(frame, draw);
    frame.components
      .flatMap((b) => b.pins)
      .forEach((wire) => showWire(arduino, wire));
  }

  deleteUnusedComponents(draw, frame);

  return;
};

const findOrCreateArduino = (draw: Svg) => {
  let arduino = findArduinoEl(draw);

  if (arduino) {
    return arduino;
  }

  draw.svg(arduinoSVGText);
  arduino = draw.findOne('#Layer_1') as Element;
  arduino.node.id = 'arduino_main_svg';
  arduino.findOne('#MESSAGE').hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  (window as any).arduinoText = arduinoSVGText;
  (draw as any).zoom((0.5 / 650) * draw.width()); // ZOOM MUST GO FIRST TO GET THE RIGHT X Y VALUES IN POSITIONING.
  arduino.y(draw.viewbox().y2 - arduino.height() + 20);
  arduino.x(0);

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

const deleteUnusedComponents = (draw: Svg, frame: ArduinoFrame | undefined) => {
  draw.find('.component').forEach((c: Element) => {
    const componentId = c.attr('id');
    // If there are not frames just delete all the components
    if (!frame) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
      return;
    }

    // If the component does not exist delete it
    if (
      frame.components.filter((c) => componentId === componentToSvgId(c))
        .length === 0
    ) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
    }
  });
};
