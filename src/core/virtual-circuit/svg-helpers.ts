import {
  ArduinoComponentType,
  ArduinoComponentState,
} from '../frames/state/arduino.state';

export const componentToSvgId = (component: ArduinoComponentState) => {
  return component.type + '_' + component.pins.join('-');
};
