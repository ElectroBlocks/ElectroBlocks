import {
  ArduinoComponentState,
  ArduinoComponentType,
} from '../frames/arduino.frame';
import { Element, Svg, Line } from '@svgdotjs/svg.js';
import { LCDScreenState } from '../frames/arduino-components.state';

export const componentToSvgId = (component: ArduinoComponentState) => {
  if (component.type === ArduinoComponentType.LCD_SCREEN) {
    const lcd = component as LCDScreenState;
    return (
      component.type +
      '_' +
      lcd.columns +
      '_' +
      lcd.rows +
      component.pins.join('-')
    );
  }

  return component.type + '_' + component.pins.join('-');
};

export const findComponentConnection = (
  element: Element,
  connectionId: string
) => {
  const connection = findSvgElement(connectionId, element);

  // if (connection instanceof Line) {
  //   const [point1, point2] = connection.plot();
  //   return {
  //     x: point1[0] + point2[0] ,
  //     y: point1[1] + point2[1]  ,
  //   };
  // }

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