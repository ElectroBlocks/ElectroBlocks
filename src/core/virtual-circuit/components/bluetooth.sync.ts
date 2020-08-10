import {
  SyncComponent,
  CreateComponentHook,
  ResetComponent,
  CreateWire,
} from '../svg.component';
import { BluetoothState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import {
  updateWires,
  createWire,
  createGroundWire,
  createPowerWire,
} from '../wire';

import bluetoothSvg from '../svgs/bluetooth/bluetooth.svg';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { addDraggableEvent } from '../component-events.helpers';

export const bluetoothReset: ResetComponent = (bluetoothEl: Element) => {
  bluetoothEl.findOne('#MESSAGE_LAYER').hide();
};

export const bluetoothUpdate: SyncComponent = (state, frame, draw) => {
  const bluetoothState = state as BluetoothState;
  const id = componentToSvgId(bluetoothState);
  let bluetoothEl = draw.findOne('#' + id) as Element;
  if (!bluetoothEl) {
    console.error('bluetooth id not found: ' + id);
    return;
  }

  const textBubble = bluetoothEl.findOne('#MESSAGE_LAYER');
  const textLine1 = bluetoothEl.findOne('#MESSAGE_LINE_1') as Text;
  const textLine2 = bluetoothEl.findOne('#MESSAGE_LINE_2') as Text;
  const textLine3 = bluetoothEl.findOne('#MESSAGE_LINE_3') as Text;

  if (
    bluetoothState.sendMessage.length > 0 &&
    frame.blockName == 'bluetooth_send_message'
  ) {
    // only display if we are on the bluetooth block that is sending the message.
    const message = getMessage(bluetoothState.sendMessage);
    textLine1.node.textContent = 'Send Message';
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }
  if (bluetoothState.hasMessage) {
    // if the bluetooth has message display the message
    const message = getMessage(bluetoothState.message);
    textLine1.node.textContent = 'Incoming Message:';
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }

  textBubble.hide();
};

export const bluetoothCreate: CreateComponentHook<BluetoothState> = (
  state,
  bluetoothEl,
  arduinoEl,
  draw
) => {
  positionComponent(bluetoothEl, arduinoEl, draw, state.txPin, 'PIN_TX');
};

const createWires: CreateWire<BluetoothState> = (
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
