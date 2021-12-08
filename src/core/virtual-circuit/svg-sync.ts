import {
  ArduinoComponentState,
  ArduinoFrame,
  ArduinoComponentType,
} from "../frames/arduino.frame";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";
import type { Svg, Element } from "@svgdotjs/svg.js";
import { servoUpdate, servoReset } from "../../blocks/servo/virtual-circuit";
import {
  arduinoMessageUpdate,
  resetArduinoMessage,
} from "../../blocks/message/virtual-circuit";
import { lcdUpdate, lcdReset } from "../../blocks/lcd_screen/virtual-circuit";
import { updateRgbLed, resetRgbLed } from "../../blocks/rgbled/virtual-circuit";
import _ from "lodash";
import {
  neoPixelUpdate,
  neoPixelReset,
} from "../../blocks/neopixels/virtual-circuit";
import {
  fastLEDUpdate,
  fastLEDReset,
} from "../../blocks/fastled/virtual-circuit";
import {
  ledMatrixUpdate,
  ledMatrixReset,
} from "../../blocks/led_matrix/virtual-circuit";
import { resetLed, updateLed } from "../../blocks/led/virtual-circuit";
import {
  digitalAnalogWritePinSync,
  digitalAnalogWritePinReset,
} from "../../blocks/writepin/virtual-circuit";

import { motorUpdate, motorReset } from "../../blocks/motors/virtual-circuit";
import {
  updateIrRemote,
  resetIrRemote,
} from "../../blocks/ir_remote/virtual-circuit";
import {
  updateUltraSonicSensor,
  resetUltraSonicSensor,
} from "../../blocks/ultrasonic_sensor/virtual-circuit";
import { updateRfid, resetRfid } from "../../blocks/rfid/virtual-circuit";
import {
  updateTemp,
  resetTemp,
} from "../../blocks/temperature/virtual-circuit";
import {
  bluetoothReset,
  bluetoothUpdate,
} from "../../blocks/bluetooth/virtual-circuit";
import { resetButton, updateButton } from "../../blocks/button/virtual-circuit";
import {
  resetDigitalSensor,
  updateDigitalSensor,
} from "../../blocks/digitalsensor/virtual-circuit";

import {
  analogSensorUpdate,
  analogSensorReset,
} from "../../blocks/analogsensor/virtual-circuit";
import {
  resetThermistorSensor,
  updateThermistorSensor,
} from "../../blocks/thermistor/virtual-circuit";
import {
  resetPassiveBuzzer,
  updatePassiveBuzzer,
} from "../../blocks/passivebuzzer/virtual-circuit";
import {
  resetStepperMotor,
  updateStepperMotor,
} from "../../blocks/steppermotor/virtual-circuit";
import {
  digitalDisplayReset,
  digitalDisplayUpdate,
} from "../../blocks/digit4display/virtual-circuit";
import {
  resetJoyStick,
  updateJoyStick,
} from "../../blocks/joystick/virtual-circuit";

export interface SyncComponent {
  (
    state: ArduinoComponentState,
    componentEl: Element,
    draw: Svg,
    frame: ArduinoFrame | undefined
  ): void;
}

export interface ResetComponent {
  (componentEl: Element): void;
}

const resetComponent = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothReset,
  [ArduinoComponentType.BUTTON]: resetButton,
  [ArduinoComponentType.IR_REMOTE]: resetIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdReset,
  [ArduinoComponentType.LED_COLOR]: resetRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixReset,
  [ArduinoComponentType.MESSAGE]: resetArduinoMessage,
  [ArduinoComponentType.MOTOR]: motorReset,
  [ArduinoComponentType.LED]: resetLed,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelReset,
  [ArduinoComponentType.FASTLED_STRIP]: fastLEDReset,
  [ArduinoComponentType.RFID]: resetRfid,
  [ArduinoComponentType.SERVO]: servoReset,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: resetTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: resetUltraSonicSensor,
  [ArduinoComponentType.WRITE_PIN]: digitalAnalogWritePinReset,
  [ArduinoComponentType.DIGITAL_SENSOR]: resetDigitalSensor,
  [ArduinoComponentType.ANALOG_SENSOR]: analogSensorReset,
  [ArduinoComponentType.THERMISTOR]: resetThermistorSensor,
  [ArduinoComponentType.PASSIVE_BUZZER]: resetPassiveBuzzer,
  [ArduinoComponentType.STEPPER_MOTOR]: resetStepperMotor,
  [ArduinoComponentType.DIGITAL_DISPLAY]: digitalDisplayReset,
  [ArduinoComponentType.JOYSTICK]: resetJoyStick,
};

const syncComponent = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothUpdate,
  [ArduinoComponentType.BUTTON]: updateButton,
  [ArduinoComponentType.IR_REMOTE]: updateIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdUpdate,
  [ArduinoComponentType.LED_COLOR]: updateRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixUpdate,
  [ArduinoComponentType.LED]: updateLed,
  [ArduinoComponentType.MOTOR]: motorUpdate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageUpdate,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelUpdate,
  [ArduinoComponentType.FASTLED_STRIP]: fastLEDUpdate,
  [ArduinoComponentType.RFID]: updateRfid,
  [ArduinoComponentType.SERVO]: servoUpdate,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: updateTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: updateUltraSonicSensor,
  [ArduinoComponentType.WRITE_PIN]: digitalAnalogWritePinSync,
  [ArduinoComponentType.DIGITAL_SENSOR]: updateDigitalSensor,
  [ArduinoComponentType.ANALOG_SENSOR]: analogSensorUpdate,
  [ArduinoComponentType.THERMISTOR]: updateThermistorSensor,
  [ArduinoComponentType.PASSIVE_BUZZER]: updatePassiveBuzzer,
  [ArduinoComponentType.STEPPER_MOTOR]: updateStepperMotor,
  [ArduinoComponentType.DIGITAL_DISPLAY]: digitalDisplayUpdate,
  [ArduinoComponentType.JOYSTICK]: updateJoyStick,
};

export const syncComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components
    .filter((state) => state.type !== ArduinoComponentType.TIME)
    .filter((state) => _.isFunction(syncComponent[state.type]))
    .filter(
      (state) =>
        state.type === ArduinoComponentType.MESSAGE ||
        draw.findOne("#" + arduinoComponentStateToId(state))
    )
    .map((state) => [
      state,
      syncComponent[state.type],
      draw.findOne("#" + arduinoComponentStateToId(state)),
    ])
    .forEach(
      ([state, func, compoenntEl]: [
        ArduinoComponentState,
        SyncComponent,
        Element
      ]) => {
        func(state, compoenntEl, draw, frame);
      }
    );

  // Reset all components elements that don't have state in the frame
  const componentIds = frame.components
    .filter((c) => c.type !== ArduinoComponentType.TIME)
    .map((c) => arduinoComponentStateToId(c));

  draw
    .find(".component")
    .filter((componentEl) => !componentIds.includes(componentEl.id()))
    .filter((componentEl) =>
      _.isFunction(resetComponent[componentEl.data("component-type")])
    )
    .map((componentEl) => [
      componentEl,
      resetComponent[componentEl.data("component-type")],
    ])
    .forEach(([componentEl, func]: [Element, ResetComponent]) =>
      func(componentEl)
    );
};
