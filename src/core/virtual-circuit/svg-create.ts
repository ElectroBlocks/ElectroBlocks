import { createComponentEl } from "./svg-helpers";
import type { Element, Svg } from "@svgdotjs/svg.js";
import {
  ArduinoComponentState,
  ArduinoComponentType,
} from "../frames/arduino.frame";
import { addDraggableEvent } from "./component-events.helpers";
import {
  bluetoothPosition,
  createBluetoothWires,
  bluetoothCreate,
} from "../../blocks/bluetooth/virtual-circuit";
import {
  createIrRemote,
  createWiresIrRemote,
  positionIrRemote,
} from "../../blocks/ir_remote/virtual-circuit";
import {
  createWiresLcd,
  lcdCreate,
  lcdPosition,
} from "../../blocks/lcd_screen/virtual-circuit";
import {
  createWiresRgbLed,
  createRgbLed,
  positionRgbLed,
} from "../../blocks/rgbled/virtual-circuit";
import {
  createWiresLedMatrix,
  ledMatrixCreate,
  ledMatrixPosition,
} from "../../blocks/led_matrix/virtual-circuit";

import {
  ledCreate,
  createWiresLed,
  ledPosition,
} from "../../blocks/led/virtual-circuit";

import { arduinoMessageCreate } from "../../blocks/message/virtual-circuit";
import {
  motorCreate,
  motorPosition,
} from "../../blocks/motors/virtual-circuit";
import {
  neoPixelCreate,
  createWiresNeoPixels,
  neoPixelPosition,
} from "../../blocks/neopixels/virtual-circuit";
import {
  fastLEDCreate,
  createWiresFastLEDs,
  fastLEDPosition,
} from "../../blocks/fastled/virtual-circuit";
import {
  digitalAnanlogWritePinCreate,
  createWiresDigitalAnalogWrite,
  digitalAnanlogWritePinPosition,
} from "../../blocks/writepin/virtual-circuit";

import {
  createWiresRfid,
  positionRfid,
  createRfid,
} from "../../blocks/rfid/virtual-circuit";
import {
  servoCreate,
  createWiresServo,
  servoPosition,
} from "../../blocks/servo/virtual-circuit";
import {
  createTemp,
  createWiresTemp,
  positionTemp,
} from "../../blocks/temperature/virtual-circuit";
import {
  createWiresUltraSonicSensor,
  positionUltraSonicSensor,
  createUltraSonicSensor,
} from "../../blocks/ultrasonic_sensor/virtual-circuit";
import { getSvgString } from "./svg-string";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";
import type {
  BreadBoardArea,
  MicroController,
} from "../microcontroller/microcontroller";
import {
  createButton,
  createWiresButton,
  positionButton,
} from "../../blocks/button/virtual-circuit";
import {
  createWireDigitalSensor,
  positionDigitalSensor,
  createDigitalSensor,
} from "../../blocks/digitalsensor/virtual-circuit";

import {
  analogSensorCreate,
  analogSensorPosition,
  createWireAnalogSensors,
} from "../../blocks/analogsensor/virtual-circuit";
import type { Settings } from "../../firebase/model";
import {
  showPin,
  takeBoardArea,
  takeBoardAreaWithExistingComponent,
} from "./wire";
import {
  createThermistorSensorHook,
  createThermistorWires,
  positionThermistorSensor,
} from "../../blocks/thermistor/virtual-circuit";
import {
  afterCreatePassiveBuzzer,
  createWiresPassiveBuzzer,
  positionPassiveBuzzer,
} from "../../blocks/passivebuzzer/virtual-circuit";
import {
  createWireStepperMotor,
  positionStepperMotor,
} from "../../blocks/steppermotor/virtual-circuit";
import {
  createWiresDigitalDisplay,
  digitalDisplayCreate,
  digitalDisplayPosition,
} from "../../blocks/digit4display/virtual-circuit";
import {
  afterComponentHookJoyStick,
  createWireJoyStick,
  positionJoyStick,
} from "../../blocks/joystick/virtual-circuit";
import { ANALOG_PINS } from "../microcontroller/selectBoard";

export default (
  state: ArduinoComponentState,
  draw: Svg,
  arduinoEl: Element,
  board: MicroController,
  settings: Settings
): void => {
  const id = arduinoComponentStateToId(state);
  let componentEl = draw.findOne("#" + id) as Element;

  if (componentEl) {
    // make sure the area get taken
    takeBoardAreaWithExistingComponent(componentEl.data("holes").split("-"));
    // Show all the analog pins because they will turn off no matter what
    // in paint.
    state.pins
      .filter((p) => ANALOG_PINS.includes(p))
      .forEach((p) => showPin(draw, p));

    return;
  }

  // only take an area if the component does
  // not exist
  const area = takeBoardArea();

  componentEl = createComponentEl(draw, state, getSvgString(state));
  addDraggableEvent(componentEl, arduinoEl, draw);
  (window as any)[state.type] = componentEl;
  if (area) {
    componentEl.data("holes", area.holes.join("-"));
    positionComponentHookFunc[state.type](
      state,
      componentEl,
      arduinoEl,
      draw,
      board,
      area
    );
    createWires[state.type](
      state,
      draw,
      componentEl,
      arduinoEl,
      id,
      board,
      area
    );
  }
  createComponentHookFunc[state.type](
    state,
    componentEl,
    arduinoEl,
    draw,
    board,
    settings
  );
};

export interface PositionComponent<T extends ArduinoComponentState> {
  (
    state: T,
    componentEl: Element,
    arduinoEl: Element,
    draw: Svg,
    board: MicroController,
    area?: BreadBoardArea
  ): void;
}

export interface AfterComponentCreateHook<T extends ArduinoComponentState> {
  (
    state: T,
    componentEl: Element,
    arduinoEl: Element,
    draw: Svg,
    board: MicroController,
    settings: Settings
  ): void;
}

export interface CreateWire<T extends ArduinoComponentState> {
  (
    state: T,
    draw: Svg,
    component: Element,
    arduinoEl: Element,
    componentId: string,
    board: MicroController,
    area?: BreadBoardArea
  ): void;
}

const createNoWires: CreateWire<ArduinoComponentState> = (
  state,
  draw,
  component,
  arduino,
  id,
  area
) => {};

const emptyPositionComponent: PositionComponent<ArduinoComponentState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {};

const emptyCreateHookComponent: AfterComponentCreateHook<ArduinoComponentState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  wire
) => {};

const createWires: { [key: string]: CreateWire<ArduinoComponentState> } = {
  [ArduinoComponentType.BLUE_TOOTH]: createBluetoothWires,
  [ArduinoComponentType.BUTTON]: createWiresButton,
  [ArduinoComponentType.IR_REMOTE]: createWiresIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: createWiresLcd,
  [ArduinoComponentType.LED_COLOR]: createWiresRgbLed,
  [ArduinoComponentType.LED_MATRIX]: createWiresLedMatrix,
  [ArduinoComponentType.LED]: createWiresLed,
  [ArduinoComponentType.MESSAGE]: createNoWires,
  [ArduinoComponentType.MOTOR]: createNoWires,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: createWiresNeoPixels,
  [ArduinoComponentType.FASTLED_STRIP]: createWiresFastLEDs,
  [ArduinoComponentType.RFID]: createWiresRfid,
  [ArduinoComponentType.SERVO]: createWiresServo,
  [ArduinoComponentType.WRITE_PIN]: createWiresDigitalAnalogWrite,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createWiresTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createWiresUltraSonicSensor,
  [ArduinoComponentType.DIGITAL_SENSOR]: createWireDigitalSensor,
  [ArduinoComponentType.ANALOG_SENSOR]: createWireAnalogSensors,
  [ArduinoComponentType.THERMISTOR]: createThermistorWires,
  [ArduinoComponentType.PASSIVE_BUZZER]: createWiresPassiveBuzzer,
  [ArduinoComponentType.STEPPER_MOTOR]: createWireStepperMotor,
  [ArduinoComponentType.DIGITAL_DISPLAY]: createWiresDigitalDisplay,
  [ArduinoComponentType.JOYSTICK]: createWireJoyStick,
};

const positionComponentHookFunc: {
  [key: string]: PositionComponent<ArduinoComponentState>;
} = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothPosition,
  [ArduinoComponentType.BUTTON]: positionButton,
  [ArduinoComponentType.IR_REMOTE]: positionIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdPosition,
  [ArduinoComponentType.LED_COLOR]: positionRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixPosition,
  [ArduinoComponentType.LED]: ledPosition,
  [ArduinoComponentType.MESSAGE]: emptyPositionComponent,
  [ArduinoComponentType.MOTOR]: motorPosition,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelPosition,
  [ArduinoComponentType.FASTLED_STRIP]: fastLEDPosition,
  [ArduinoComponentType.WRITE_PIN]: digitalAnanlogWritePinPosition,
  [ArduinoComponentType.RFID]: positionRfid,
  [ArduinoComponentType.SERVO]: servoPosition,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: positionTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: positionUltraSonicSensor,
  [ArduinoComponentType.DIGITAL_SENSOR]: positionDigitalSensor,
  [ArduinoComponentType.ANALOG_SENSOR]: analogSensorPosition,
  [ArduinoComponentType.THERMISTOR]: positionThermistorSensor,
  [ArduinoComponentType.PASSIVE_BUZZER]: positionPassiveBuzzer,
  [ArduinoComponentType.STEPPER_MOTOR]: positionStepperMotor,
  [ArduinoComponentType.DIGITAL_DISPLAY]: digitalDisplayPosition,
  [ArduinoComponentType.JOYSTICK]: positionJoyStick,
};

const createComponentHookFunc: {
  [key: string]: AfterComponentCreateHook<ArduinoComponentState>;
} = {
  [ArduinoComponentType.BLUE_TOOTH]: bluetoothCreate,
  [ArduinoComponentType.BUTTON]: createButton,
  [ArduinoComponentType.IR_REMOTE]: createIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: lcdCreate,
  [ArduinoComponentType.LED_COLOR]: createRgbLed,
  [ArduinoComponentType.LED_MATRIX]: ledMatrixCreate,
  [ArduinoComponentType.MESSAGE]: arduinoMessageCreate,
  [ArduinoComponentType.MOTOR]: motorCreate,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelCreate,
  [ArduinoComponentType.FASTLED_STRIP]: fastLEDCreate,
  [ArduinoComponentType.WRITE_PIN]: digitalAnanlogWritePinCreate,
  [ArduinoComponentType.LED]: ledCreate,
  [ArduinoComponentType.RFID]: createRfid,
  [ArduinoComponentType.SERVO]: servoCreate,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createUltraSonicSensor,
  [ArduinoComponentType.DIGITAL_SENSOR]: createDigitalSensor,
  [ArduinoComponentType.ANALOG_SENSOR]: analogSensorCreate,
  [ArduinoComponentType.THERMISTOR]: createThermistorSensorHook,
  [ArduinoComponentType.PASSIVE_BUZZER]: afterCreatePassiveBuzzer,
  [ArduinoComponentType.STEPPER_MOTOR]: emptyCreateHookComponent,
  [ArduinoComponentType.DIGITAL_DISPLAY]: digitalDisplayCreate,
  [ArduinoComponentType.JOYSTICK]: afterComponentHookJoyStick,
};
