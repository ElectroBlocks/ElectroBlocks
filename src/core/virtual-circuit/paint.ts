import arduinoSVGText from "./svgs/boards/arduino_uno.svg";
import { Svg, Element } from "@svgdotjs/svg.js";
import { ArduinoFrame, ArduinoComponentType } from "../frames/arduino.frame";
import { ARDUINO_UNO_PINS } from "../microcontroller/selectBoard";
import { resetBreadBoardWholes } from "./wire";
import { findMicronControllerEl } from "./svg-helpers";
import createNewComponent from "./svg-create";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";
import { MicroControllerType } from "../microcontroller/microcontroller";

export default (
  draw: Svg,
  boardType: MicroControllerType,
  frame: ArduinoFrame = undefined
) => {
  const arduino = findOrCreateMicroController(draw, boardType);
  console.log(boardType, boardType, "IT WORKED BOARDTYPE");
  resetBreadBoardWholes();
  hideAllWires(arduino, boardType);

  if (frame) {
    frame.components
      .filter((c) => c.type !== ArduinoComponentType.MESSAGE)
      .forEach((state) => {
        state.pins.forEach((pin) => showWire(arduino, pin));
        createNewComponent(state, draw, arduino);
      });
  }

  deleteUnusedComponents(draw, frame);
};

const findOrCreateMicroController = (
  draw: Svg,
  boardType: MicroControllerType
) => {
  let arduino = findMicronControllerEl(draw);

  if (arduino && arduino.data("type") === boardType) {
    // Have to reset this because it's part of the arduino
    arduino.findOne("#MESSAGE").hide();
    return arduino;
  }

  draw.svg(arduinoSVGText);
  arduino = draw.findOne("#MicroController") as Element;
  arduino.data("type", boardType);
  arduino.node.id = "microcontroller_main_svg";
  arduino.findOne("#MESSAGE").hide();
  (window as any).arduino = arduino;
  (window as any).draw = draw;
  (window as any).arduinoText = arduinoSVGText;
  (draw as any).zoom((0.5 / 650) * draw.width()); // ZOOM MUST GO FIRST TO GET THE RIGHT X Y VALUES IN POSITIONING.
  arduino.y(draw.viewbox().y2 - arduino.height() + 80);
  arduino.x(0);

  return arduino;
};

const hideAllWires = (arduino: Element, boardType: MicroControllerType) => {
  Object.keys(ARDUINO_UNO_PINS)
    .map((key) => arduino.find("#" + key)[0])
    .filter((wire) => wire !== undefined)
    .forEach((wire) => wire.hide());
};

const showWire = (arduino: Element, wire: string) => {
  arduino.findOne("#PIN_" + wire).show();
};

const deleteUnusedComponents = (draw: Svg, frame: ArduinoFrame | undefined) => {
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

    // If the component does not exist delete it
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
};
