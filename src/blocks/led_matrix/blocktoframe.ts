import _ from 'lodash';
import { findFieldValue } from '../../core/blockly/helpers/block-data.helper';
import {
  ArduinoComponentType,
  ArduinoFrame,
} from '../../core/frames/arduino.frame';
import type { BlockToFrameTransformer } from '../../core/frames/transformer/block-to-frame.transformer';
import { getInputValue } from '../../core/frames/transformer/block-to-value.factories';
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from '../../core/frames/transformer/frame-transformer.helpers';
import type { LedMatrixState } from './state';

export const ledMatrixSetup: BlockToFrameTransformer = (
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
          isOn: false,
        };
      }),
    ];
  }, []);
  const ledMatrixState: LedMatrixState = {
    type: ArduinoComponentType.LED_MATRIX,
    pins: [
      findFieldValue(block, 'PIN_CLK'),
      findFieldValue(block, 'PIN_CS'),
      findFieldValue(block, 'PIN_DATA'),
    ],
    leds,
    clkPin: findFieldValue(block, 'PIN_CLK'),
    csPin: findFieldValue(block, 'PIN_CS'),
    dataPin: findFieldValue(block, 'PIN_DATA'),
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledMatrixState,
      'Setting up led matrix.',
      previousState
    ),
  ];
};

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
          isOn: findFieldValue(block, `${row},${col}`) === 'TRUE',
        };
      }),
    ];
  }, []);
  const { pins, type, dataPin, csPin, clkPin } = getLedMatrix(previousState);
  const ledMatrixState: LedMatrixState = {
    type,
    pins,
    leds,
    clkPin,
    csPin,
    dataPin,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledMatrixState,
      'Drawing on LED Matrix.',
      previousState
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
  const { pins, type, leds, dataPin, csPin, clkPin } = getLedMatrix(
    previousState
  );

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
    dataPin,
    csPin,
    clkPin,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Led Matrix turn (${row},${col}) ${isOn ? 'on' : 'off'}.`,
      previousState
    ),
  ];
};

const getLedMatrix = (previousState?: ArduinoFrame): LedMatrixState => {
  return findComponent<LedMatrixState>(
    previousState,
    ArduinoComponentType.LED_MATRIX
  );
};
