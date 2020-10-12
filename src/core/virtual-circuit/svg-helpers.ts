import type { ArduinoComponentState } from "../frames/arduino.frame";
import type { Element, Svg, Line } from "@svgdotjs/svg.js";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";

export const findComponentConnection = (
  element: Element,
  connectionId: string
) => {
  const connection = findSvgElement(connectionId, element);

  return {
    x: connection.cx() + element.x(),
    y: connection.y() + connection.height() + element.y(),
  };
};

export const findSvgElement = (
  id: string,
  draw: Svg | Element
): Svg | Element => {
  return draw.findOne("#" + id) as Svg | Element;
};

export const deleteWires = (draw: Svg, id: string) => {
  draw
    .find("line")
    .filter((w) => w.data("component-id") === id)
    .forEach((w) => w.remove());
};

export const createComponentEl = (
  draw: Svg,
  state: ArduinoComponentState,
  svgText: string
) => {
  const componentEl = draw.svg(svgText).last();
  componentEl.addClass("component");
  componentEl.attr("id", arduinoComponentStateToId(state));
  componentEl.data("component-type", state.type);
  (componentEl as Svg).viewbox(0, 0, componentEl.width(), componentEl.height());

  return componentEl;
};

export const findMicronControllerEl = (draw: Svg): Element => {
  return draw.findOne("#microcontroller_main_svg") as Element | Svg;
};

export const addWireConnectionClass = (ids: string[], componentEl: Element) => {
  ids.forEach((id) => {
    componentEl.findOne("#" + id).addClass("wire-connection");
  });
};

export enum LED_COLORS {
  LED_ON = "#ffa922",
  LED_OFF = "#F2F2F2",
  POWER_ON = "#49ff7e",
}
