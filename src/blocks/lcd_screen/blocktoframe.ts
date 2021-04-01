import _ from "lodash";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { LCDScreenState } from "./state";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from "../../core/frames/transformer/frame-transformer.helpers";

export const lcdScreenSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const rows = findFieldValue(block, "SIZE") === "20 x 4" ? 4 : 2;
  const columns = findFieldValue(block, "SIZE") === "20 x 4" ? 20 : 16;
  const sdaPin = findFieldValue(block, "PIN_SDA");
  const sclPin = findFieldValue(block, "PIN_SCL");
  const lcdState: LCDScreenState = {
    pins: block.pins.sort(),
    rows,
    columns,
    type: ArduinoComponentType.LCD_SCREEN,
    memoryType: findFieldValue(block, "MEMORY_TYPE"),
    blink: { row: 0, column: 0, blinking: false },
    backLightOn: true,
    rowsOfText: [
      "                    ",
      "                    ",
      "                    ",
      "                    ",
    ],
    sdaPin,
    sclPin,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      lcdState,
      "Setting up LCD Screen.",
      previousState
    ),
  ];
};

export const lcdBlink: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const isBlinking = findFieldValue(block, "BLINK") === "BLINK";
  const lcdState = _.cloneDeep(
    findComponent<LCDScreenState>(
      previousState,
      ArduinoComponentType.LCD_SCREEN
    )
  );

  if (!isBlinking) {
    const newComponent: LCDScreenState = {
      ...lcdState,
      blink: { row: 0, column: 0, blinking: false },
    };

    return [
      arduinoFrameByComponent(
        block.id,
        block.blockName,
        timeline,
        newComponent,
        `Turning off blinking.`,
        previousState
      ),
    ];
  }

  const row = getDefaultIndexValue(
    1,
    4,
    getInputValue(blocks, block, variables, timeline, "ROW", 1, previousState)
  );

  const column = getDefaultIndexValue(
    1,
    20,
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

  const newComponent: LCDScreenState = {
    ...lcdState,
    blink: { row, column, blinking: true },
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Turning on blinking at (${column}, ${row}).`,
      previousState
    ),
  ];
};

export const lcdScroll: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    findComponent<LCDScreenState>(
      previousState,
      ArduinoComponentType.LCD_SCREEN
    )
  );

  const direction = findFieldValue(block, "DIR") as string;

  const rowsOfText = lcdState.rowsOfText.map((text) => {
    if (direction === "RIGHT") {
      return " " + text.substr(0, 19);
    }
    return text.substr(1, 19) + " ";
  });

  const newComponent: LCDScreenState = {
    ...lcdState,
    rowsOfText,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Scrolling text to the ${direction.toLowerCase()}.`,
      previousState
    ),
  ];
};

export const lcdPrint: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    findComponent<LCDScreenState>(
      previousState,
      ArduinoComponentType.LCD_SCREEN
    )
  );

  const row = getDefaultIndexValue(
    1,
    4,
    getInputValue(blocks, block, variables, timeline, "ROW", 1, previousState)
  );

  const column = getDefaultIndexValue(
    1,
    20,
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

  const print = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "PRINT",
    "",
    previousState
  );

  const rowsOfText = lcdState.rowsOfText.map((text, index) => {
    if (index + 1 !== row) {
      return text;
    }

    const actualColumn = column - 1;
    _.range(actualColumn, actualColumn + print.length).forEach(
      (textIndex, rangeIndex) => {
        text = replaceAt(text, textIndex, print[rangeIndex]);
      }
    );

    return text.substr(0, 20);
  });

  const newComponent: LCDScreenState = {
    ...lcdState,
    rowsOfText,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Printing "${print}" to the screen at position (${column}, ${row}).`,
      previousState
    ),
  ];
};

function replaceAt(string: string, index: number, replace: string) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

export const lcdClear: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    previousState.components.find(
      (c) => c.type == ArduinoComponentType.LCD_SCREEN
    )
  ) as LCDScreenState;

  const clearComponent: LCDScreenState = {
    ..._.cloneDeep(lcdState),
    rowsOfText: [
      "                    ",
      "                    ",
      "                    ",
      "                    ",
    ],
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      clearComponent,
      `Clearing the screen.`,
      previousState,
      false,
      false,
      0
    ),
  ];
};

export const lcdBacklight: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    previousState.components.find(
      (c) => c.type == ArduinoComponentType.LCD_SCREEN
    )
  ) as LCDScreenState;

  const backLightOn = findFieldValue(block, "BACKLIGHT") == "ON";

  const newComponent: LCDScreenState = {
    ...lcdState,
    backLightOn,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Turning ${backLightOn ? "on" : "off"} backlight.`,
      previousState
    ),
  ];
};

export const lcdSimplePrint: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    previousState.components.find(
      (c) => c.type == ArduinoComponentType.LCD_SCREEN
    )
  ) as LCDScreenState;

  const rowsOfText = _.range(1, 5).map((i) => {
    return getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "ROW_" + i,
      "",
      previousState
    );
  });

  const delay = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    "DELAY",
    1,
    previousState
  );

  const newComponent: LCDScreenState = {
    ..._.cloneDeep(lcdState),
    rowsOfText: rowsOfText.map((text: string) => {
      if (text.length >= 20) {
        return text.slice(0, 20);
      }

      return (
        text +
        _.range(0, lcdState.columns - text.length)
          .map(() => " ")
          .join("")
      );
    }),
  };

  const clearComponent: LCDScreenState = {
    ..._.cloneDeep(newComponent),
    rowsOfText: [
      "                    ",
      "                    ",
      "                    ",
      "                    ",
    ],
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Printing message for ${delay.toFixed(2)} seconds.`,
      previousState,
      false,
      false,
      delay * 1000
    ),
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      clearComponent,
      `Clearing the screen.`,
      previousState,
      false,
      false,
      0
    ),
  ];
};
