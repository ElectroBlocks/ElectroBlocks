import _ from "lodash";
import getToolBoxString from "./getToolBoxString";
import { updateToolbox } from "../helpers/workspace.helper";
import bluetoothXMLString from "../../../blocks/bluetooth/toolbox";
import buttonXMLString from "../../../blocks/button/toolbox";
import irRmoteXMLString from "../../../blocks/ir_remote/toolbox";
import neoPixelXMLString from "../../../blocks/neopixels/toolbox";
import ledMatrixXMLString from "../../../blocks/led_matrix/toolbox";
import arduinoXMLString from "../../../blocks/arduino/toolbox";
import functionXMLString from "../../../blocks/functions/toolbox";
import lcdScreenXMLString from "../../../blocks/lcd_screen/toolbox";
import rgbLedXMLString from "../../../blocks/rgbled/toolbox";

import { COLOR_THEME } from "../constants/colors";

const toolboxKey = "blockly_tool_box";

/**
 * Saves a toolbox
 */
const saveToolBox = (entries: ToolBoxEntries[]) => {
  updateToolbox(getToolBoxString(entries));

  return localStorage.setItem(toolboxKey, JSON.stringify(entries));
};

/**
 * Fetches the toolbox entries
 */
const fetchToolBox = (): ToolBoxEntries[] => {
  if (_.isEmpty(localStorage.getItem(toolboxKey))) {
    return defaultToolbox;
  }
  return JSON.parse(localStorage.getItem(toolboxKey) || "");
};

export interface ToolBoxEntries {
  category: ToolBoxCategory;
  name: string;
  toolBoxEntries: ToolBoxEntry[];
  color: COLOR_THEME;
}

export interface ToolBoxEntry {
  name: string;
  xml: string;
  show: boolean;
}

export enum ToolBoxCategory {
  COMPONENT = "Component",
  SENSORS = "Sensors",
  ARDUINO = "Arduino",
  NONE = "NONE",
  SEPARATOR = "SEPARATOR",
}

const defaultToolbox: ToolBoxEntries[] = [
  {
    color: COLOR_THEME.CONTROL,
    category: ToolBoxCategory.NONE,
    name: "Functions",
    toolBoxEntries: [
      {
        name: "My Blocks",
        show: true,
        xml: functionXMLString,
      },
    ],
  },
  {
    color: COLOR_THEME.ARDUINO,
    category: ToolBoxCategory.ARDUINO,
    name: "Arduino",
    toolBoxEntries: [
      {
        name: "Arduino",
        show: true,
        xml: arduinoXMLString,
      },
    ],
  },

  {
    color: COLOR_THEME.COMPONENTS,
    category: ToolBoxCategory.COMPONENT,
    name: "Components",
    toolBoxEntries: [
      { name: "Bluetooth", show: true, xml: bluetoothXMLString },
      { name: "LCD Screen", show: true, xml: lcdScreenXMLString },
      { name: "Neo Pixel", show: true, xml: neoPixelXMLString },
      { name: "Led Matrix", show: true, xml: ledMatrixXMLString },
      { name: "RBG Led", show: true, xml: rgbLedXMLString },
    ],
  },
  {
    color: COLOR_THEME.SENSOR,
    category: ToolBoxCategory.SENSORS,
    name: "Sensors",
    toolBoxEntries: [
      { name: "Button", show: true, xml: buttonXMLString },
      { name: "IR Remote", show: true, xml: irRmoteXMLString },
    ],
  },

  // { name: 'Logic', show: true },
  // { name: 'Loops', show: true },
  // { name: 'List', show: true },
  // { name: 'Variables', show: true },
  // { name: 'Functions', show: true },
  // { name: 'Color', show: true },
  // { name: 'Math', show: true },
  // { name: 'Text', show: true },
  // { name: 'Buttons', show: true },
  // { name: 'Code', show: true },
  // { name: 'Message', show: true },
  // { name: 'Analog', show: true },
  // { name: 'Digital', show: true },
  // { name: 'Time', show: true },
  // { name: 'LCD Screen', show: true },
  // { name: 'Led', show: true },
  // { name: 'Led Light Strip', show: true },
  // { name: 'Led Matrix', show: true },
  // { name: 'Motor / Servo', show: true },
  // { name: 'IR Remote', show: true },
  // { name: 'Motion', show: true },
  // { name: 'RFID', show: true },
  // { name: 'Temp', show: true },
];

export { saveToolBox, fetchToolBox };
