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
import type { LedMatrixState } from "./state";

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

  const dataPin = findFieldValue(block, "PIN_DATA");
  const csPin = findFieldValue(block, "PIN_CS");
  const clkPin = findFieldValue(block, "PIN_CLK");
  const ledMatrixState: LedMatrixState = {
    type: ArduinoComponentType.LED_MATRIX,
    pins: [
      findFieldValue(block, "PIN_CLK"),
      findFieldValue(block, "PIN_CS"),
      findFieldValue(block, "PIN_DATA"),
    ],
    leds,
    clkPin,
    csPin,
    dataPin,
    setupCommand: `register::ma::${dataPin}::${csPin}::${clkPin}`,
    importLibraries: [
      {
        name: "LedControl",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/wayoda/LedControl-1.0.6.zip",
      },
    ],
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledMatrixState,
      "Setting up led matrix.",
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
          isOn: findFieldValue(block, `${row},${col}`) === "TRUE",
        };
      }),
    ];
  }, []);
  const previousLedMatrix = _.cloneDeep(getLedMatrix(previousState));
  const usbCommands = makeLedCommands(previousLedMatrix.dataPin, leds);

  const ledMatrixState: LedMatrixState = {
    ...previousLedMatrix,
    leds,
    usbCommands,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      ledMatrixState,
      "Drawing on LED Matrix.",
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
  const { pins, type, leds, dataPin, csPin, clkPin } =
    getLedMatrix(previousState);

  const row = getDefaultIndexValue(
    1,
    8,
    getInputValue(blocks, block, variables, timeline, "ROW", 1, previousState)
  );

  const col = getDefaultIndexValue(
    1,
    8,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "COLUMN",
      1,
      previousState
    )
  );

  const isOn = findFieldValue(block, "STATE") === "ON";

  const newLeds = leds.map((led) => {
    if (led.col === col && led.row === row) {
      return { col, row, isOn };
    }

    return led;
  });

  const usbCommands = makeLedCommands(dataPin, newLeds);
  const previousLedMatrix = _.cloneDeep(getLedMatrix(previousState));
  const newComponent: LedMatrixState = {
    ...previousLedMatrix,
    leds: newLeds,
    usbCommands: [
      `write::ma::${dataPin}::1::${col - 1}::${8 - row}::${isOn ? 1 : 0}`,
    ],
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Led Matrix turn (${row},${col}) ${isOn ? "on" : "off"}.`,
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

const makeLedCommands = (
  pin: string,
  leds: Array<{ row: number; col: number; isOn: boolean }>
): string[] => {
  let baseCommand = `write::ma::${pin}::2`;
  const ledMap = leds.reduce(
    (acc, led) => {
      if (!led.isOn) {
        return acc;
      }
      const row = 8 - led.row;
      const col = 8 - led.col;
      acc[row] += Math.pow(2, col);
      return acc;
    },
    [0, 0, 0, 0, 0, 0, 0, 0]
  );
  return [`${baseCommand}::${ledMap.join("::")}`];
};

export const ledsToBytes = (
  leds: { row: number; col: number; isOn: boolean }[]
): number[] => {
  const rows = _.groupBy(leds, "row");
  return _.range(1, 9).map((row) => {
    const rowLeds = rows[row] || [];
    return rowLeds.reduce((byte, led) => {
      return byte | ((led.isOn ? 1 : 0) << (8 - led.col));
    }, 0);
  });
};

