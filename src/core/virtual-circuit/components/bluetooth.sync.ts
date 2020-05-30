import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { BluetoothState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
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

  (bluetoothEl as any).draggable().on('dragmove', () => {
    updateWires(bluetoothEl, draw, arduino as Svg);
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
    '#31eb75',
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

// HIGHLIGHTING WIRES
// window.bluetooth.findOne('#HELPER_TEXT').findOne('#HELPER_PIN_RX').stroke({width: 0});
