import type { Svg, Element } from "@svgdotjs/svg.js";
import {
  ArduinoFrame,
  ArduinoComponentType,
  ArduinoFrameContainer,
} from "../frames/arduino.frame";
import { ANALOG_PINS, getBoard } from "../microcontroller/selectBoard";
import { resetBreadBoardHoles } from "./wire";
import {
  hideAllAnalogWires,
  resetBreadBoardHoles as resetBreadBoardHolesV2,
} from "./wire-v2";
import { findMicronControllerEl } from "./svg-helpers";
import createNewComponent from "./svg-create";
import type { MicroController } from "../microcontroller/microcontroller";
import { getBoardSvg } from "./get-board-svg";
import { registerHighlightEvents } from "./highlightevent";

export default (draw: Svg, frameContainer: ArduinoFrameContainer) => {
  const board = getBoard(frameContainer.board);

  const arduino = findOrCreateMicroController(draw, board);

  clearComponents(draw, arduino);

  const lastFrame = frameContainer.frames
    ? frameContainer.frames[frameContainer.frames.length - 1]
    : undefined;
  resetBreadBoardHoles(board);
  resetBreadBoardHolesV2(board);
  hideAllAnalogWires(draw);
  // TODO HIDE ANALOG PINS AND CREATE MAP FOR EACH BOARD PROFILE.

  if (lastFrame) {
    lastFrame.components
      .filter((c) => c.type !== ArduinoComponentType.MESSAGE)
      .filter((c) => c.type !== ArduinoComponentType.TIME)
      .forEach((state) => {
        state.pins.forEach((pin) => showWire(arduino, pin));
        createNewComponent(
          state,
          draw,
          arduino,
          board,
          frameContainer.settings
        );
      });
  }
};

const findOrCreateMicroController = (draw: Svg, board: MicroController) => {
  let arduino = findMicronControllerEl(draw);

  if (arduino && arduino.data("type") === board.type) {
    // Have to reset this because it's part of the arduino
    arduino.findOne("#MESSAGE").hide();
    return arduino;
  }

  if (arduino) {
    // This means that the board has changed
    draw.children().forEach((c) => c.remove());
  }

  arduino = draw.svg(getBoardSvg(board.type)).last();
  arduino.attr("id", "MicroController");
  arduino.data("type", board.type);
  arduino.node.id = "microcontroller_main_svg";
  arduino.findOne("#MESSAGE").hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  const zoomWidth = draw.width() / arduino.width();
  const minusAmount = draw.height() - 300 > 200 ? 250 : 150;
  const zoomHeight = (draw.height() - minusAmount) / arduino.height();
  (draw as any).zoom(zoomHeight < zoomWidth ? zoomHeight : zoomWidth); // ZOOM MUST GO FIRST TO GET THE RIGHT X Y VALUES IN POSITIONING.
  arduino.y(draw.viewbox().y2 - arduino.height());
  arduino.x(-30);

  // Events

  registerHighlightEvents(arduino);

  return arduino;
};

const showWire = (arduino: Element, wire: string) => {
  const wireSvg = arduino.findOne("#PIN_" + wire);
  if (wireSvg) {
    wireSvg.show();
  }
};

const clearComponents = (draw: Svg, arduino: Element) => {
  draw.find(".component").forEach((c: Element) => {
    const componentId = c.attr("id");
    // If there are not frames just delete all the components
    c.remove();
    draw.find(`[data-component-id=${componentId}]`).forEach((c) => c.remove());
    return;
  });

  arduino.findOne("#MESSAGE").hide();
};
