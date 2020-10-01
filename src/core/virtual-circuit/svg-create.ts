import { createComponentEl } from "./svg-helpers";
import { Element, Svg } from "@svgdotjs/svg.js";
import {
  ArduinoComponentState,
  ArduinoComponentType,
} from "../frames/arduino.frame";
import { addDraggableEvent } from "./component-events.helpers";
import {
  bluetoothPosition,
  createBluetoothWires,
  bluetoothCreate,
} from "../../plugins/components/bluetooth/virtual-circuit";
import {
  createButton,
  createWiresButton,
  positionButton,
} from "../../plugins/components/button/virtual-circuit";
import {
  createIrRemote,
  createWiresIrRemote,
  positionIrRemote,
} from "./components/ir_remote.sync";
import { createWiresLcd, lcdCreate, lcdPosition } from "./components/lcd.sync";
import {
  createWiresRgbLed,
  createRgbLed,
  positionRgbLed,
} from "./components/rgbled.sync";
import {
  createWiresLedMatrix,
  ledMatrixCreate,
  ledMatrixPosition,
} from "./components/ledmatrix.sync";
import { arduinoMessageCreate } from "./components/arduino-message.sync";
import { motorCreate, motorPosition } from "./components/motor.sync";
import {
  neoPixelCreate,
  createWiresNeoPixels,
  neoPixelPosition,
} from "./components/neoPixel.sync";
import {
  createDigitalAnalogWire,
  createPinComponent,
  positionPinComponent,
} from "./components/pin.component";
import {
  createWiresRfid,
  positionRfid,
  createRfid,
} from "./components/rfid.sync";
import {
  servoCreate,
  createWiresServo,
  servoPosition,
} from "./components/servo.sync";
import {
  createTemp,
  createWiresTemp,
  positionTemp,
} from "./components/temp.sync";
import {
  createWiresUltraSonicSensor,
  positionUltraSonicSensor,
  createUltraSonicSensor,
} from "./components/ultrasonic.sync";
import { getSvgString } from "./svg-string";
import { arduinoComponentStateToId } from "../frames/arduino-component-id";
import { MicroController } from "../microcontroller/microcontroller";

export default (
  state: ArduinoComponentState,
  draw: Svg,
  arduinoEl: Element,
  board: MicroController
): void => {
  const id = arduinoComponentStateToId(state);
  let componentEl = draw.findOne("#" + id) as Element;

  if (componentEl) {
    return;
  }
  componentEl = createComponentEl(draw, state, getSvgString(state));
  addDraggableEvent(componentEl, arduinoEl, draw);
  (window as any)[state.type] = componentEl;
  positionComponentHookFunc[state.type](
    state,
    componentEl,
    arduinoEl,
    draw,
    board
  );
  createWires[state.type](state, draw, componentEl, arduinoEl, id, board);
  createComponentHookFunc[state.type](
    state,
    componentEl,
    arduinoEl,
    draw,
    board
  );
};

export interface PositionComponent<T extends ArduinoComponentState> {
  (
    state: T,
    componentEl: Element,
    arduinoEl: Element,
    draw: Svg,
    board: MicroController
  ): void;
}

export interface CreateCompenentHook<T extends ArduinoComponentState> {
  (
    state: T,
    componentEl: Element,
    arduinoEl: Element,
    draw: Svg,
    board: MicroController
  ): void;
}

export interface CreateWire<T extends ArduinoComponentState> {
  (
    state: T,
    draw: Svg,
    component: Element,
    arduinoEl: Element,
    componentId: string,
    board: MicroController
  ): void;
}

const createNoWires: CreateWire<ArduinoComponentState> = (
  state,
  draw,
  component,
  arduino,
  id
) => {};

const emptyPositionComponent: PositionComponent<ArduinoComponentState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {};

const emptyCreateHookComponent: CreateCompenentHook<ArduinoComponentState> = (
  state,
  componentEl,
  arduinoEl,
  draw
) => {};

const createWires: { [key: string]: CreateWire<ArduinoComponentState> } = {
  [ArduinoComponentType.BLUE_TOOTH]: createBluetoothWires,
  [ArduinoComponentType.BUTTON]: createWiresButton,
  [ArduinoComponentType.IR_REMOTE]: createWiresIrRemote,
  [ArduinoComponentType.LCD_SCREEN]: createWiresLcd,
  [ArduinoComponentType.LED_COLOR]: createWiresRgbLed,
  [ArduinoComponentType.LED_MATRIX]: createWiresLedMatrix,
  [ArduinoComponentType.MESSAGE]: createNoWires,
  [ArduinoComponentType.MOTOR]: createNoWires,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: createWiresNeoPixels,
  [ArduinoComponentType.PIN]: createDigitalAnalogWire,
  [ArduinoComponentType.RFID]: createWiresRfid,
  [ArduinoComponentType.SERVO]: createWiresServo,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createWiresTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createWiresUltraSonicSensor,
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
  [ArduinoComponentType.MESSAGE]: emptyPositionComponent,
  [ArduinoComponentType.MOTOR]: motorPosition,
  [ArduinoComponentType.NEO_PIXEL_STRIP]: neoPixelPosition,
  [ArduinoComponentType.PIN]: positionPinComponent,
  [ArduinoComponentType.RFID]: positionRfid,
  [ArduinoComponentType.SERVO]: servoPosition,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: positionTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: positionUltraSonicSensor,
};

const createComponentHookFunc: {
  [key: string]: CreateCompenentHook<ArduinoComponentState>;
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
  [ArduinoComponentType.PIN]: createPinComponent,
  [ArduinoComponentType.RFID]: createRfid,
  [ArduinoComponentType.SERVO]: servoCreate,
  [ArduinoComponentType.TEMPERATURE_SENSOR]: createTemp,
  [ArduinoComponentType.ULTRASONICE_SENSOR]: createUltraSonicSensor,
};
