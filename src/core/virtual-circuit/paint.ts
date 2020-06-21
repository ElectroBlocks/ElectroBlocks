import arduinoSVGText from './svgs/arduino.svg';
import { Svg, Element } from '@svgdotjs/svg.js';
import { ArduinoFrame } from '../frames/arduino.frame';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';
import { createComponents } from './svg.component';
import { resetBreadBoardWholes } from './wire';
import { componentToSvgId } from './svg-helpers';

export default (
  draw: Svg,
  frame: ArduinoFrame = undefined,
  showArduino = true
) => {
  const arduino = findOrCreateArduino(draw);

  if (showArduino) {
    resetBreadBoardWholes();
    hideAllWires(arduino);
  }

  if (!showArduino) {
    arduino.remove();
  }

  console.log(frame, 'did state exist');
  if (frame) {
    createComponents(frame, draw, showArduino);
  }

  if (showArduino && frame) {
    const arduino = findOrCreateArduino(draw);
    frame.components
      .flatMap((b) => b.pins)
      .forEach((wire) => showWire(arduino, wire));
  }

  deleteUnusedComponents(draw, frame);
};

const findOrCreateArduino = (draw: Svg) => {
  let [arduino] = draw.find('#arduino_main_svg');

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
  arduino.x((arduino.bbox().width / 3) * -1);

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

const deleteUnusedComponents = (draw: Svg, frame: ArduinoFrame) => {
  draw.find('.component').forEach((c: Element) => {
    const componentId = c.attr('id');
    // If there are not frames just delete all the components
    if (!frame) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
      console.log('removed');
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
