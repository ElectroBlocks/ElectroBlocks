import type { Element, Svg, Text } from "@svgdotjs/svg.js";
import type {
  AfterComponentCreateHook,
  CreateWire,
  PositionComponent,
} from "../../core/virtual-circuit/svg-create";
import { positionComponent } from "../../core/virtual-circuit/svg-position";
import type {
  ResetComponent,
  SyncComponent,
} from "../../core/virtual-circuit/svg-sync";
import {
  createComponentWire, createFromArduinoToComponent,
  createGroundOrPowerWire, createGroundOrPowerWireArduino,
} from "../../core/virtual-circuit/wire";
import type { BluetoothState } from "./state";
import {ARDUINO_PINS} from "../../core/microcontroller/selectBoard";

export const bluetoothReset: ResetComponent = (bluetoothEl: Element) => {
  bluetoothEl.findOne("#MESSAGE_LAYER").hide();
};

export const bluetoothUpdate: SyncComponent = (
  state: BluetoothState,
  bluetoothEl,
  _,
  frame
) => {
  const textBubble = bluetoothEl.findOne("#MESSAGE_LAYER");
  const textLine1 = bluetoothEl.findOne("#MESSAGE_LINE_1") as Text;
  const textLine2 = bluetoothEl.findOne("#MESSAGE_LINE_2") as Text;
  const textLine3 = bluetoothEl.findOne("#MESSAGE_LINE_3") as Text;

  if (
    state.sendMessage.length > 0 &&
    frame.blockName == "bluetooth_send_message"
  ) {
    // only display if we are on the bluetooth block that is sending the message.
    const message = getMessage(state.sendMessage);
    textLine1.node.textContent = "Send Message";
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }
  if (state.hasMessage) {
    // if the bluetooth has message display the message
    const message = getMessage(state.message);
    textLine1.node.textContent = "Incoming Message:";
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }

  textBubble.hide();
};

export const bluetoothPosition: PositionComponent<BluetoothState> = (
  state,
  bluetoothEl,
  arduinoEl,
  draw,
  board,
  area
) => {
  if(area) {
    const {holes, isDown} = area;
    positionComponent(bluetoothEl, arduinoEl, draw, "PIN_TX", holes[1], isDown);
  } else {
    positionComponent(bluetoothEl, arduinoEl, draw, "PIN_TX");
  }
  // positionComponent(bluetoothEl, arduinoEl, draw, state.txPin, "PIN_TX", board);
};

export const bluetoothCreate: AfterComponentCreateHook<BluetoothState> = (
  state,
  bluetoothEl
) => {
  bluetoothEl.findOne("#RX_PIN_TEXT").node.innerHTML = state.rxPin;
  bluetoothEl.findOne("#TX_PIN_TEXT").node.innerHTML = state.txPin;
};

export const createBluetoothWires: CreateWire<BluetoothState> = (
  state,
  draw,
  bluetoothEl,
  arduinoEl,
  id,
  board,
  area = null
) => {
  const { rxPin, txPin } = state;
  if(area) {

    const {holes, isDown} = area;
    createComponentWire(
        holes[0],
        isDown,
        bluetoothEl,
        rxPin,
        draw,
        arduinoEl,
        id,
        "PIN_RX",
        board
    );

    createComponentWire(
        holes[1],
        isDown,
        bluetoothEl,
        txPin,
        draw,
        arduinoEl,
        id,
        "PIN_TX",
        board
    );

    createGroundOrPowerWire(
        holes[2],
        isDown,
        bluetoothEl,
        draw,
        arduinoEl,
        id,
        "ground"
    );

    createGroundOrPowerWire(
        holes[3],
        isDown,
        bluetoothEl,
        draw,
        arduinoEl,
        id,
        "power"
    );
  } else {
    createFromArduinoToComponent(
        draw,
        arduinoEl as Svg,
        rxPin,
        bluetoothEl,
        "PIN_RX",
        board
    );

    createFromArduinoToComponent(
        draw,
        arduinoEl as Svg,
        txPin,
        bluetoothEl,
        "PIN_TX",
        board
    );
    createGroundOrPowerWireArduino(draw, arduinoEl as Svg, board.bluetooth[0] as ARDUINO_PINS, bluetoothEl, board, "ground")
    createGroundOrPowerWireArduino(draw, arduinoEl as Svg, board.bluetooth[1] as ARDUINO_PINS, bluetoothEl, board, "power")
  }
};

const getMessage = (message: string) => {
  return message.length > 38 ? message.slice(0, 35) + "..." : message;
};
