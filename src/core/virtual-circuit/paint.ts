import type { Svg, Element } from "@svgdotjs/svg.js";
import {
  ArduinoFrame,
  ArduinoComponentType,
  ArduinoFrameContainer,
} from "../frames/arduino.frame";
import { getBoard } from "../microcontroller/selectBoard";
import { resetBreadBoardWholes } from "./wire";
import { findMicronControllerEl } from "./svg-helpers";
import createNewComponent from "./svg-create";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";
import type {
  MicroController,
} from "../microcontroller/microcontroller";
import { getBoardSvg } from "./get-board-svg";

export default (draw: Svg, frameContainer: ArduinoFrameContainer) => {
  const board = getBoard(frameContainer.board);

  const arduino = findOrCreateMicroController(draw, board);
  const lastFrame =frameContainer.frames ? frameContainer.frames[frameContainer.frames.length - 1]: undefined;
  resetBreadBoardWholes(board);
  hideAllWires(arduino, board);

  if (lastFrame) {
    lastFrame.components
      .filter((c) => c.type !== ArduinoComponentType.MESSAGE)
      .filter((c) => c.type !== ArduinoComponentType.TIME)
      .forEach((state) => {
        state.pins.forEach((pin) => showWire(arduino, pin));
        createNewComponent(state,draw,arduino,board,frameContainer.settings);
      });
  }

  deleteUnusedComponents(draw, arduino, lastFrame);
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

  draw.svg(getBoardSvg(board.type));
  arduino = draw.findOne("#MicroController") as Element;
  arduino.data("type", board.type);
  arduino.node.id = "microcontroller_main_svg";
  arduino.findOne("#MESSAGE").hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  (draw as any).zoom((0.5 / 650) * draw.width()); // ZOOM MUST GO FIRST TO GET THE RIGHT X Y VALUES IN POSITIONING.
  arduino.y(draw.viewbox().y2 - arduino.height() + 80);
  arduino.x(0);

  return arduino;
};

const hideAllWires = (arduino: Element, board: MicroController) => {
  [...board.digitalPins, ...board.analonPins]
    .map((key) => arduino.findOne("#PIN_" + key))
    .filter((wire) => wire !== undefined)
    .forEach((wire) => wire.hide());
};

const showWire = (arduino: Element, wire: string) => {
  const wireSvg = arduino.findOne("#PIN_" + wire);
  if (wireSvg) {
    wireSvg.show();
  }
};

const deleteUnusedComponents = (
  draw: Svg,
  arduino: Element,
  frame: ArduinoFrame | undefined
) => {
  draw.find(".component").forEach((c: Element) => {
    const componentId = c.attr("id");
    // If there are not frames just delete all the components
    if (!frame) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
      return;
    }

    // If the component does exist delete it
    if (
      frame.components.filter(
        (c) => componentId === arduinoComponentStateToId(c)
      ).length === 0
    ) {
      c.remove();
      draw
        .find(`[data-component-id=${componentId}]`)
        .forEach((c) => c.remove());
    }
  });

  if (
    
    !frame ||

       !frame.components.find((c) => c.type === ArduinoComponentType.MESSAGE)
  
  ) {
    arduino.findOne("#MESSAGE").hide();
  }
};
