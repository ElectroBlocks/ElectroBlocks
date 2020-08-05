import {
  ArduinoComponentState,
  ArduinoComponentType,
} from '../frames/arduino.frame';
import { Element, Svg, Line } from '@svgdotjs/svg.js';
import {
  LCDScreenState,
  LedColorState,
  PinState,
  MotorState,
} from '../frames/arduino-components.state';

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

  if (component.type === ArduinoComponentType.LED_COLOR) {
    const rgbLedState = component as LedColorState;
    return `${rgbLedState.type}_${
      rgbLedState.pictureType
    }_${rgbLedState.pins.join('-')}`;
  }

  if (component.type === ArduinoComponentType.PIN) {
    const pinState = component as PinState;

    return `${pinState.type}-${pinState.pinType}-${pinState.pinPicture}-${pinState.pin}`;
  }

  if (component.type === ArduinoComponentType.MOTOR) {
    const motorState = component as MotorState;

    return `${component.type}-${motorState.motorNumber}-`;
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

export const deleteWires = (draw: Svg, id: string) => {
  draw
    .find('line')
    .filter((w) => w.data('component-id') === id)
    .forEach((w) => w.remove());
};

export const createComponentEl = (
  draw: Svg,
  state: ArduinoComponentState,
  svgText: string
) => {
  const componentEl = draw.svg(svgText).last();
  componentEl.addClass('component');
  componentEl.attr('id', componentToSvgId(state));
  componentEl.data('component-type', state.type);
  (componentEl as Svg).viewbox(0, 0, componentEl.width(), componentEl.height());

  return componentEl;
};

export const findArduinoEl = (draw: Svg) => {
  return draw.findOne('#arduino_main_svg') as Element;
};

export const addWireConnectionClass = (ids: string[], componentEl: Element) => {
  ids.forEach((id) => {
    componentEl.findOne('#' + id).addClass('wire-connection');
  });
};

export enum LED_COLORS {
  LED_ON = '#ffa922',
  LED_OFF = '#F2F2F2',
  POWER_ON = '#49ff7e',
}
