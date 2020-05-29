import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { BluetoothState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import { updateWires } from '../wire';

import bluetoothSvg from '../svgs/bluetooth/bluetooth.svg';

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
  let bluetoothEl = draw.find('#' + id).pop();
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
};

// window.bluetooth.findOne('#HELPER_TEXT').findOne('#HELPER_PIN_RX').stroke({width: 0});
