import type { Svg, Element } from '@svgdotjs/svg.js';
import {
  ArduinoFrame,
  ArduinoComponentType,
  ArduinoFrameContainer,
} from '../frames/arduino.frame';
import { ANALOG_PINS, getBoard } from '../microcontroller/selectBoard';
import { hideAllAnalogWires, resetBreadBoardHoles } from './wire';
import { findMicronControllerEl } from './svg-helpers';
import createNewComponent from './svg-create';
import type { MicroController } from '../microcontroller/microcontroller';
import { getBoardSvg } from './get-board-svg';
import { registerHighlightEvents } from './highlightevent';
import { arduinoComponentStateToId } from '../frames/arduino-component-id';

export default (draw: Svg, frameContainer: ArduinoFrameContainer) => {
  const board = getBoard(frameContainer.board);

  const arduino = findOrCreateMicroController(draw, board);

  const lastFrame = frameContainer.frames
    ? frameContainer.frames[frameContainer.frames.length - 1]
    : undefined;

  clearComponents(draw, arduino, lastFrame);

  resetBreadBoardHoles(board);
  hideAllAnalogWires(draw);
  // TODO HIDE ANALOG PINS AND CREATE MAP FOR EACH BOARD PROFILE.

  if (lastFrame) {
    const components = lastFrame.components
      .filter((c) => c.type !== ArduinoComponentType.MESSAGE)
      .filter((c) => c.type !== ArduinoComponentType.TIME);

    const existingComponents = components.filter((c) =>
      draw.findOne(`#${arduinoComponentStateToId(c)}`)
    );

    const newComponents = components.filter(
      (c) => !draw.findOne(`#${arduinoComponentStateToId(c)}`)
    );

    // existing components must go first to take up areas of the breadboard that already exist
    [...existingComponents, ...newComponents].forEach((state) => {
      state.pins.forEach((pin) => showWire(arduino, pin));
      createNewComponent(state, draw, arduino, board, frameContainer.settings);
    });
  }

  // This gets the tallest component
  const tallestComponentHeight = lastFrame
    ? lastFrame.components
        .map((c) => draw.findOne(`#${arduinoComponentStateToId(c)}`) as Element)
        .reduce((acc, next) => {
          return acc > next.height() ? acc : next.height();
        }, 0)
    : 0;

  const zoomWidth = draw.width() / (arduino.x() + arduino.width());
  const zoomHeight =
    draw.height() / (arduino.y() + arduino.height() + tallestComponentHeight);

  (draw as any).zoom(zoomHeight > zoomWidth ? zoomWidth : zoomHeight);

  const tallestYValue = lastFrame
    ? lastFrame.components
        .map((c) => draw.findOne(`#${arduinoComponentStateToId(c)}`) as Element)
        .reduce((acc, next) => {
          // we are going for the least for the tallest
          return acc > next.y() ? next.y() : acc;
        }, 0)
    : arduino.y();

  const widestComponentWidth = lastFrame
    ? lastFrame.components
        .map((c) => draw.findOne(`#${arduinoComponentStateToId(c)}`) as Element)
        .reduce((acc, next) => {
          return acc > next.width() ? acc : next.width();
        }, 0)
    : 0;
  const widestWidth =
    arduino.width() > widestComponentWidth
      ? arduino.width()
      : widestComponentWidth;
  //(draw.width() - (widestWidth * draw.zoom())) / 2

  // Y value is perfect we just need figure out the x value
  // and get it to stop zooming when it's not needed
  console.log(widestWidth, 'widest');
  draw.viewbox(
    draw.width() -
      widestWidth * draw.zoom() -
      (draw.width() - widestWidth * draw.zoom()) / 2,
    tallestYValue - 20,
    draw.viewbox().w,
    draw.viewbox().h
  );
  // TODO Figure out the math to get it in the right position for x and y

  // I need to find a way to bottom center the arduino
};

const findOrCreateMicroController = (draw: Svg, board: MicroController) => {
  let arduino = findMicronControllerEl(draw);

  if (arduino && arduino.data('type') === board.type) {
    // Have to reset this because it's part of the arduino
    arduino.findOne('#MESSAGE').hide();
    return arduino;
  }

  if (arduino) {
    // This means that the board has changed
    draw.children().forEach((c) => c.remove());
  }

  arduino = draw.svg(getBoardSvg(board.type)).last();

  arduino.attr('id', 'MicroController');
  arduino.data('type', board.type);
  arduino.node.id = 'microcontroller_main_svg';
  arduino.findOne('#MESSAGE').hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  // Events

  registerHighlightEvents(arduino);
  return arduino;
};

const showWire = (arduino: Element, wire: string) => {
  const wireSvg = arduino.findOne('#PIN_' + wire);
  if (wireSvg) {
    wireSvg.show();
  }
};

const clearComponents = (
  draw: Svg,
  arduino: Element,
  lastFrame: ArduinoFrame
) => {
  draw
    .find('.component')
    // It does not exist the id
    .filter(
      (c) =>
        !lastFrame ||
        lastFrame.components.length === 0 ||
        !lastFrame.components.map(arduinoComponentStateToId).includes(c.id())
    )
    .forEach((c: Element) => {
      const componentId = c.attr('id');
      // If there are not frames just delete all the components
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
      return;
    });

  arduino.findOne('#MESSAGE').hide();
};
