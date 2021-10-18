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
