import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import _ from 'lodash';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { ArduinoComponentType, ArduinoFrame } from '../../arduino.frame';
import { ARDUINO_UNO_PINS } from '../../../blockly/selectBoard';
import { LedMatrixState } from '../../arduino-components.state';
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from '../frame-transformer.helpers';
import { getInputValue } from '../block-to-value.factories';

export const ledMatrixDraw: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const leds = _.range(1, 9).reduce((prev, row) => {
    return [
      ...prev,
      ..._.range(1, 9).map((col) => {
        return {
          row,
          col,
          isOn: findFieldValue(block, `${col},${row}`) === 'TRUE',
        };
      }),
    ];
  }, []);

  const ledMatrixState: LedMatrixState = {
    type: ArduinoComponentType.LED_MATRIX,
    pins: [
      ARDUINO_UNO_PINS.PIN_10,
      ARDUINO_UNO_PINS.PIN_11,
      ARDUINO_UNO_PINS.PIN_12,
    ],
    leds,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledMatrixState,
      'Drawing on LED Matrix.'
    ),
  ];
};

export const ledMatrixOnLed: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const { pins, type, leds } = getLedMatrix(previousState);

  const row = getDefaultIndexValue(
    1,
    8,
    getInputValue(blocks, block, variables, timeline, 'ROW', 1, previousState)
  );

  const col = getDefaultIndexValue(
    1,
    8,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      'COLUMN',
      1,
      previousState
    )
  );

  const isOn = findFieldValue(block, 'STATE') === 'ON';

  const newLeds = leds.map((led) => {
    if (led.col === col && led.row === row) {
      return { col, row, isOn };
    }

    return led;
  });

  const newComponent: LedMatrixState = {
    pins,
    type,
    leds: newLeds,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Led Matrix turn (${row},${col}) ${isOn ? 'on' : 'off'}.`
    ),
  ];
};

const getLedMatrix = (previousState?: ArduinoFrame): LedMatrixState => {
  if (_.isEmpty(previousState)) {
    return createBlankLedMatrix();
  }

  const ledMatrix = findComponent<LedMatrixState>(
    previousState,
    ArduinoComponentType.LED_MATRIX
  );

  return ledMatrix || createBlankLedMatrix();
};

const createBlankLedMatrix = () => {
  const leds = _.range(1, 9).reduce((prev, row) => {
    return [
      ...prev,
      ..._.range(1, 9).map((col) => {
        return {
          row,
          col,
          isOn: false,
        };
      }),
    ];
  }, []);

  return {
    type: ArduinoComponentType.LED_MATRIX,
    pins: [
      ARDUINO_UNO_PINS.PIN_10,
      ARDUINO_UNO_PINS.PIN_11,
      ARDUINO_UNO_PINS.PIN_12,
    ],
    leds,
  };
};
