import { ArduinoComponentState, ArduinoComponentType } from "./arduino.frame";

import _ from "lodash";
import { lcdStateId } from "../../blocks/lcd_screen/component-state-to-id";
import { neoPixelId } from "../../blocks/neopixels/component-state-to-id";
import { fastLEDId } from "../../blocks/fastled/component-state-to-id";
import { getLedColorId } from "../../blocks/rgbled/component-state-to-id";
import { writePinId } from "../../blocks/writepin/component-state-to-id";
import { getDigitalSensorId } from "../../blocks/digitalsensor/component-state-to-id";
import { getAnalogSensorId } from "../../blocks/analogsensor/component-state-to-id";
import { getMotorStateId } from "../../blocks/motors/component-to-state-id";
import { getLedId } from "../../blocks/led/component-state-to-id";

export interface ComponentStateToId {
  (state: ArduinoComponentState): string;
}

const genericSingleComponentId = (state: ArduinoComponentState) => {
  return state.type + "_" + state.pins.sort().join("-");
};

const componentStateFuncs: { [key: string]: ComponentStateToId } = {
  [ArduinoComponentType.BLUE_TOOTH]: genericSingleComponentId,
  [ArduinoComponentType.BUTTON]: genericSingleComponentId,
  [ArduinoComponentType.IR_REMOTE]: genericSingleComponentId,
  [ArduinoComponentType.LED_MATRIX]: genericSingleComponentId,
  [ArduinoComponentType.MOTOR]: getMotorStateId,
  [ArduinoComponentType.MESSAGE]: () => ArduinoComponentType.MESSAGE.toString(),
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelId,
  [ArduinoComponentType.FASTLED_STRIP]: fastLEDId,
  [ArduinoComponentType.RFID]: genericSingleComponentId,
  [ArduinoComponentType.SERVO]: genericSingleComponentId,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: genericSingleComponentId,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: genericSingleComponentId,
  [ArduinoComponentType.LCD_SCREEN]: lcdStateId,
  [ArduinoComponentType.LED_COLOR]: getLedColorId,
  [ArduinoComponentType.LED]: getLedId,
  [ArduinoComponentType.WRITE_PIN]: writePinId,
  [ArduinoComponentType.DIGITAL_SENSOR]: getDigitalSensorId,
  [ArduinoComponentType.ANALOG_SENSOR]: getAnalogSensorId,
  [ArduinoComponentType.THERMISTOR]: genericSingleComponentId,
  [ArduinoComponentType.PASSIVE_BUZZER]: genericSingleComponentId,
  [ArduinoComponentType.STEPPER_MOTOR]: genericSingleComponentId,
  [ArduinoComponentType.DIGITAL_DISPLAY]: genericSingleComponentId,
  [ArduinoComponentType.JOYSTICK]: genericSingleComponentId,
  [ArduinoComponentType.TIME]: genericSingleComponentId,
};

export const arduinoComponentStateToId = (
  state: ArduinoComponentState
): string => {
  if (_.isFunction(componentStateFuncs[state.type])) {
    return componentStateFuncs[state.type](state);
  }

  throw new Error("No Id generator found for state type " + state.type);
};
