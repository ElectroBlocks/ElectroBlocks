import { SyncComponent, ResetComponent } from '../svg-sync';
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from '../svg-create';

import { BluetoothState } from '../../frames/arduino-components.state';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import { createWire, createGroundWire, createPowerWire } from '../wire';

export const bluetoothReset: ResetComponent = (bluetoothEl: Element) => {
  bluetoothEl.findOne('#MESSAGE_LAYER').hide();
};

export const bluetoothUpdate: SyncComponent = (
  state: BluetoothState,
  bluetoothEl,
  _,
  frame
) => {
  const textBubble = bluetoothEl.findOne('#MESSAGE_LAYER');
  const textLine1 = bluetoothEl.findOne('#MESSAGE_LINE_1') as Text;
  const textLine2 = bluetoothEl.findOne('#MESSAGE_LINE_2') as Text;
  const textLine3 = bluetoothEl.findOne('#MESSAGE_LINE_3') as Text;

  if (
    state.sendMessage.length > 0 &&
    frame.blockName == 'bluetooth_send_message'
  ) {
    // only display if we are on the bluetooth block that is sending the message.
    const message = getMessage(state.sendMessage);
    textLine1.node.textContent = 'Send Message';
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }
  if (state.hasMessage) {
    // if the bluetooth has message display the message
    const message = getMessage(state.message);
    textLine1.node.textContent = 'Incoming Message:';
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
  draw
) => {
  positionComponent(bluetoothEl, arduinoEl, draw, state.txPin, 'PIN_TX');
};

export const bluetoothCreate: CreateCompenentHook<BluetoothState> = (
  state,
  bluetoothEl
) => {
  bluetoothEl.findOne('#RX_PIN_TEXT').node.innerHTML = state.rxPin;
  bluetoothEl.findOne('#TX_PIN_TEXT').node.innerHTML = state.txPin;
};

export const createBluetoothWires: CreateWire<BluetoothState> = (
  state,
  draw,
  bluetoothEl,
  arduinoEl,
  id
) => {
  const { rxPin, txPin } = state;
  createWire(bluetoothEl, rxPin, 'PIN_RX', arduinoEl, draw, '#ac4cf5', 'rx');

  createWire(bluetoothEl, txPin, 'PIN_TX', arduinoEl, draw, '#0f5873', 'tx');

  createGroundWire(bluetoothEl, txPin, arduinoEl as Svg, draw, id, 'right');

  createPowerWire(bluetoothEl, txPin, arduinoEl as Svg, draw, id, 'right');
};

const getMessage = (message: string) => {
  return message.length > 38 ? message.slice(0, 35) + '...' : message;
};
