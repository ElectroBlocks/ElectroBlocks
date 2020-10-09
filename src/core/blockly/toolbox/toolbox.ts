import _ from "lodash";
import getToolBoxString from "./getToolBoxString";
import { updateToolbox } from "../helpers/workspace.helper";
import bluetoothXMLString from "../../../blocks/bluetooth/toolbox";
import buttonXMLString from "../../../blocks/button/toolbox";
import irRmoteXMLString from "../../../blocks/ir_remote/toolbox";
import neoPixelXMLString from "../../../blocks/neopixels/toolbox";
import ledMatrixXMLString from "../../../blocks/led_matrix/toolbox";
import arduinoXMLString from "../../../blocks/arduino/toolbox";
import listXMLString from "../../../blocks/list/toolbox";
import functionXMLString from "../../../blocks/functions/toolbox";
import lcdScreenXMLString from "../../../blocks/lcd_screen/toolbox";
import rgbLedXMLString from "../../../blocks/rgbled/toolbox";
import ledXMLString from "../../../blocks/led/toolbox";
import writePinXMLString from "../../../blocks/writepin/toolbox";
import digitalSensorXMLString from "../../../blocks/digitalsensor/toolbox";
import analogSensorXMLString from "../../../blocks/analogsensor/toolbox";
import logicXMLString from "../../../blocks/logic/toolbox";
import loopXMLString from "../../../blocks/loops/toolbox";
import timeXMLString from "../../../blocks/time/toolbox";
import mathXMLString from "../../../blocks/math/toolbox";
import colorXMLString from "../../../blocks/color/toolbox";
import messageXMLString from "../../../blocks/message/toolbox";
import ultraSonicXMLString from "../../../blocks/ultrasonic_sensor/toolbox";
import motorXMLString from "../../../blocks/motors/toolbox";
import variablesXMLString from "../../../blocks/variables/toolbox";
import rfidXMLString from "../../../blocks/rfid/toolbox";
import servoXMLString from "../../../blocks/servo/toolbox";

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
  DATA = "DATA",
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
        name: "Logic",
        show: true,
        xml: logicXMLString,
      },
      {
        name: "Loop",
        show: true,
        xml: loopXMLString,
      },
      {
        name: "My Blocks",
        show: true,
        xml: functionXMLString,
      },
      {
        name: "Variables",
        show: true,
        xml: variablesXMLString,
      },
      {
        name: "List",
        show: true,
        xml: listXMLString,
      },
    ],
  },
  {
    color: COLOR_THEME.VALUES,
    category: ToolBoxCategory.DATA,
    name: "Data",
    toolBoxEntries: [
      {
        name: "Color",
        show: true,
        xml: colorXMLString,
      },
      {
        name: "Math",
        show: true,
        xml: mathXMLString,
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
      {
        name: "Message",
        show: true,
        xml: messageXMLString,
      },
      {
        name: "Time",
        show: true,
        xml: timeXMLString,
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
      { name: "Led", show: true, xml: ledXMLString },
      { name: "Led Matrix", show: true, xml: ledMatrixXMLString },
      { name: "Motor", show: true, xml: motorXMLString },
      { name: "Neo Pixel", show: true, xml: neoPixelXMLString },
      { name: "Pins", show: true, xml: writePinXMLString },
      { name: "RBG Led", show: true, xml: rgbLedXMLString },
      { name: "Servos", show: true, xml: servoXMLString },
    ],
  },
  {
    color: COLOR_THEME.SENSOR,
    category: ToolBoxCategory.SENSORS,
    name: "Sensors",
    toolBoxEntries: [
      { name: "Analog", show: true, xml: analogSensorXMLString },
      { name: "Button", show: true, xml: buttonXMLString },
      { name: "Digital Sensor", show: true, xml: digitalSensorXMLString },
      { name: "IR Remote", show: true, xml: irRmoteXMLString },
      { name: "Motion Sensor", show: true, xml: ultraSonicXMLString },
      { name: "RFID", show: true, xml: rfidXMLString },
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
