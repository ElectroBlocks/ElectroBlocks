import {
  ArduinoComponentState,
  ArduinoFrame,
  ArduinoComponentType,
} from "../frames/arduino.frame";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";
import { Svg, Element } from "@svgdotjs/svg.js";
import { servoUpdate, servoReset } from "./components/servo.sync";
import {
  arduinoMessageUpdate,
  resetArduinoMessage,
} from "./components/arduino-message.sync";
import { lcdUpdate, lcdReset } from "../../blocks/lcd_screen/virtual-circuit";
import {
  updateRgbLed,
  resetRgbLed,
} from "../../blocks/ledcolor/virtual-circuit";
import {
  updatePinComponent,
  resetPinComponent,
} from "./components/pin.component";
import _ from "lodash";
import {
  neoPixelUpdate,
  neoPixelReset,
} from "../../blocks/neopixels/virtual-circuit";
import {
  ledMatrixUpdate,
  ledMatrixReset,
} from "../../blocks/led_matrix/virtual-circuit";
import { motorUpdate, motorReset } from "./components/motor.sync";
import {
  updateIrRemote,
  resetIrRemote,
} from "../../blocks/ir_remote/virtual-circuit";
import {
  updateUltraSonicSensor,
  resetUltraSonicSensor,
} from "./components/ultrasonic.sync";
import { updateRfid, resetRfid } from "./components/rfid.sync";
import { updateTemp, resetTemp } from "./components/temp.sync";
import {
  bluetoothReset,
  bluetoothUpdate,
} from "../../blocks/bluetooth/virtual-circuit";
import { resetButton, updateButton } from "../../blocks/button/virtual-circuit";

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
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelReset,
  [ArduinoComponentType.PIN]: resetPinComponent,
  [ArduinoComponentType.RFID]: resetRfid,
  [ArduinoComponentType.SERVO]: servoReset,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: resetTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: resetUltraSonicSensor,
};

const syncComponent = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothUpdate,
  [ArduinoComponentType.BUTTON]: updateButton,
  [ArduinoComponentType.IR_REMOTE]: updateIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdUpdate,
  [ArduinoComponentType.LED_COLOR]: updateRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixUpdate,
  [ArduinoComponentType.MOTOR]: motorUpdate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageUpdate,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelUpdate,
  [ArduinoComponentType.PIN]: updatePinComponent,
  [ArduinoComponentType.RFID]: updateRfid,
  [ArduinoComponentType.SERVO]: servoUpdate,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: updateTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: updateUltraSonicSensor,
};

export const syncComponents = (frame: ArduinoFrame, draw: Svg) => {
  frame.components
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
  const componentIds = frame.components.map((c) =>
    arduinoComponentStateToId(c)
  );

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
