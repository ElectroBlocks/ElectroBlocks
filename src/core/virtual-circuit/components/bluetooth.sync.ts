import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { BluetoothState } from '../../frames/arduino-components.state';
import { componentToSvgId, findSvgElement } from '../svg-helpers';
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

export const bluetoothSync: SyncComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.BLUE_TOOTH) {
    return;
  }

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
    frame.explanation.includes('from bluetooth to computer.')
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
    textLine1.node.textContent = 'Receive Message';
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }

  textBubble.hide();
};

export const bluetoothCreate: CreateComponent = (state, frame, draw) => {
  if (state.type !== ArduinoComponentType.BLUE_TOOTH) {
    return;
  }

  const bluetoothState = state as BluetoothState;

  const id = componentToSvgId(bluetoothState);
  let bluetoothEl = draw.findOne('#' + id) as Element;
  const arduino = draw.findOne('#arduino_main_svg') as Element;
  if (bluetoothEl) {
    positionComponent(
      bluetoothEl,
      arduino,
      draw,
      bluetoothState.txPin,
      'WIRE_TX'
    );
    updateWires(bluetoothEl, draw, arduino as Svg);
    return;
  }

  bluetoothEl = draw.svg(bluetoothSvg).last();
  bluetoothEl.addClass('component');
  bluetoothEl.attr('id', id);
  bluetoothEl.findOne('#HELPER_TEXT').hide();
  (bluetoothEl as Svg).viewbox(0, 0, bluetoothEl.width(), bluetoothEl.height());
  (window as any).bluetooth = bluetoothEl;
  positionComponent(
    bluetoothEl,
    arduino,
    draw,
    bluetoothState.txPin,
    'WIRE_TX'
  );
  bluetoothEl.findOne('#MESSAGE_LAYER').hide();
  createWires(
    bluetoothEl,
    arduino,
    draw,
    bluetoothState.rxPin,
    bluetoothState.txPin,
    id
  );

  bluetoothEl.findOne('#WIRE_RX').addClass('wire-connection');
  bluetoothEl.findOne('#WIRE_TX').addClass('wire-connection');
  bluetoothEl.findOne('#GND_BOX').addClass('wire-connection');
  bluetoothEl.findOne('#_5V_BOX').addClass('wire-connection');

  (bluetoothEl as any).draggable().on('dragmove', (e) => {
    bluetoothEl.findOne('#HELPER_TEXT').hide();
    updateWires(bluetoothEl, draw, arduino as Svg);
  });

  bluetoothEl.findOne('#GND_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(bluetoothEl, 'GND');
  });

  bluetoothEl.findOne('#WIRE_RX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(bluetoothEl, 'RX');
  });

  bluetoothEl.findOne('#WIRE_TX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(bluetoothEl, 'TX');
  });

  bluetoothEl.findOne('#_5V_BOX').on('click', (e) => {
    e.stopPropagation();
    showToolTip(bluetoothEl, 'VCC');
  });
};

const createWires = (
  bluetoothEl: Element,
  arduino: Svg | Element,
  draw: Svg,
  rxPin: ARDUINO_UNO_PINS,
  txPin: ARDUINO_UNO_PINS,
  componentId: string
) => {
  const rxWire = createWire(
    bluetoothEl,
    rxPin,
    'WIRE_RX',
    arduino,
    draw,
    '#ac4cf5',
    'rx'
  );

  const txWire = createWire(
    bluetoothEl,
    txPin,
    'WIRE_TX',
    arduino,
    draw,
    '#0f5873',
    'rx'
  );

  const gndWire = createGroundWire(
    bluetoothEl,
    txPin,
    arduino as Svg,
    draw,
    'GND_BOX',
    componentId,
    'right'
  );

  const powerWire = createPowerWire(
    bluetoothEl,
    txPin,
    arduino as Svg,
    draw,
    '_5V_BOX',
    componentId,
    'right'
  );
};

const showToolTip = (bluetooth: Element, pinType: string) => {
  const helpTextEl = bluetooth.findOne('#HELPER_TEXT') as Element;
  helpTextEl.show();
  const pinTypeTextTop = findSvgElement('PIN_TOP', helpTextEl) as Text;
  const pinTypeTextBottom = findSvgElement('PIN_BOTTOM', helpTextEl) as Text;

  findSvgElement('HELPER_PIN_VCC', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_GND', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_TX', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_RX', helpTextEl).stroke({ width: 0 });
  if (pinType === 'GND') {
    findSvgElement('HELPER_PIN_GND', helpTextEl).stroke({ width: 4 });
    pinTypeTextTop.node.textContent = '';
    pinTypeTextBottom.node.textContent = 'GND PIN';
  }

  if (pinType === 'VCC') {
    findSvgElement('HELPER_PIN_VCC', helpTextEl).stroke({ width: 4 });
    pinTypeTextTop.node.textContent = 'Power';
    pinTypeTextBottom.node.textContent = 'VCC PIN';
  }

  if (pinType === 'TX') {
    findSvgElement('HELPER_PIN_TX', helpTextEl).stroke({ width: 4 });
    pinTypeTextTop.node.textContent = 'Transmit Data';
    pinTypeTextBottom.node.textContent = 'TXD PIN';
  }

  if (pinType === 'RX') {
    findSvgElement('HELPER_PIN_RX', helpTextEl).stroke({ width: 4 });
    pinTypeTextTop.node.textContent = 'Recieve Data';
    pinTypeTextBottom.node.textContent = 'RXD PIN';
  }

  pinTypeTextTop.cx(72);
  pinTypeTextBottom.cx(18);
};

const getMessage = (message: string) => {
  return message.length > 38 ? message.slice(0, 35) + '...' : message;
};

// HIGHLIGHTING WIRES
// window.bluetooth.findOne('#HELPER_TEXT').findOne('#HELPER_PIN_RX').stroke({width: 0});
