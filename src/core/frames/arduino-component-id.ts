import { ArduinoComponentState, ArduinoComponentType } from "./arduino.frame";
import {
  MotorState,
  LedColorState,
  PinState,
  NeoPixelState,
} from "./arduino-components.state";

import _ from "lodash";
import { lcdStateId } from "../../blocks/lcd_screen/svg-id";

export interface ComponentStateToId {
  (state: ArduinoComponentState): string;
}

const genericSingleComponentId = (state: ArduinoComponentState) => {
  return state.type + "_" + state.pins.sort().join("-");
};

const getMotorStateId = (motorState: MotorState) => {
  return `${motorState.type}-${motorState.motorNumber}`;
};

const getLedColorId = (state: LedColorState) => {
  return `${state.type}_${state.pictureType}_${state.pins.sort().join("-")}`;
};

const getPinStateId = (state: PinState) => {
  return `${state.type}-${state.pinType}-${state.pinPicture}-${state.pin}`;
};

const neoPixelId = (state: NeoPixelState) => {
  return `${state.type}-${state.pins.sort().join("-")}-${state.numberOfLeds}`;
};

const componentStateFuncs: { [key: string]: ComponentStateToId } = {
  [ArduinoComponentType.BLUE_TOOTH]: genericSingleComponentId,
  [ArduinoComponentType.BUTTON]: genericSingleComponentId,
  [ArduinoComponentType.IR_REMOTE]: genericSingleComponentId,
  [ArduinoComponentType.LED_MATRIX]: genericSingleComponentId,
  [ArduinoComponentType.MOTOR]: getMotorStateId,
  [ArduinoComponentType.MESSAGE]: () => ArduinoComponentType.MESSAGE.toString(),
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelId,
  [ArduinoComponentType.RFID]: genericSingleComponentId,
  [ArduinoComponentType.SERVO]: genericSingleComponentId,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: genericSingleComponentId,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: genericSingleComponentId,
  [ArduinoComponentType.LCD_SCREEN]: lcdStateId,
  [ArduinoComponentType.LED_COLOR]: getLedColorId,
  [ArduinoComponentType.PIN]: getPinStateId,
};

export const arduinoComponentStateToId = (
  state: ArduinoComponentState
): string => {
  if (_.isFunction(componentStateFuncs[state.type])) {
    return componentStateFuncs[state.type](state);
  }

  throw new Error("No Id generator found for state type " + state.type);
};
