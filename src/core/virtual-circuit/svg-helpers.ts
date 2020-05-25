import { ArduinoComponentState } from '../frames/arduino.frame';
import { Element, Svg } from '@svgdotjs/svg.js';

export const componentToSvgId = (component: ArduinoComponentState) => {
  return component.type + '_' + component.pins.join('-');
};

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
  return draw.findOne('#' + id) as Svg | Element;
};

export enum LED_COLORS {
  LED_ON = '#ffa922',
  LED_OFF = '#F2F2F2',
  POWER_ON = '#49ff7e',
}
