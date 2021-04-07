import _ from "lodash";
import bluetoothXMLString from "../../blocks/bluetooth/toolbox";
import buttonXMLString from "../../blocks/button/toolbox";
import irRmoteXMLString from "../../blocks/ir_remote/toolbox";
import neoPixelXMLString from "../../blocks/neopixels/toolbox";
import ledMatrixXMLString from "../../blocks/led_matrix/toolbox";
import arduinoXMLString from "../../blocks/arduino/toolbox";
import listXMLString from "../../blocks/list/toolbox";
import functionXMLString from "../../blocks/functions/toolbox";
import lcdScreenXMLString from "../../blocks/lcd_screen/toolbox";
import rgbLedXMLString from "../../blocks/rgbled/toolbox";
import ledXMLString from "../../blocks/led/toolbox";
import writePinXMLString from "../../blocks/writepin/toolbox";
import digitalSensorXMLString from "../../blocks/digitalsensor/toolbox";
import analogSensorXMLString from "../../blocks/analogsensor/toolbox";
import logicXMLString from "../../blocks/logic/toolbox";
import loopXMLString from "../../blocks/loops/toolbox";
import timeXMLString from "../../blocks/time/toolbox";
import mathXMLString from "../../blocks/math/toolbox";
import colorXMLString from "../../blocks/color/toolbox";
import messageXMLString from "../../blocks/message/toolbox";
import ultraSonicXMLString from "../../blocks/ultrasonic_sensor/toolbox";
import motorXMLString from "../../blocks/motors/toolbox";
import variablesXMLString from "../../blocks/variables/toolbox";
import rfidXMLString from "../../blocks/rfid/toolbox";
import servoXMLString from "../../blocks/servo/toolbox";
import temperatureXMLString from "../../blocks/temperature/toolbox";
import textXMLString from "../../blocks/text/toolbox";
import passiveBuzzerXMLString from "../../blocks/passivebuzzer/toolbox";
import stepperMotorXMLString from "../../blocks/steppermotor/toolbox";
import digitalDisplayXMLString from "../../blocks/digit4display/toolbox";
import joystickXMLString from "../../blocks/joystick/toolbox";

import thermistorXMLString from "../../blocks/thermistor/toolbox";

import { COLOR_THEME } from "./constants/colors";

export interface ToolBoxEntries {
  category: ToolBoxCategory;
  name: string;
  toolBoxEntries: ToolBoxEntry[];
  color: COLOR_THEME;
}

export interface ToolBoxEntry {
  name: string;
  xml: string;
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
    name: "TOP_LEVEL",
    toolBoxEntries: [
      {
        name: "Logic",
        xml: logicXMLString,
      },
      {
        name: "Loop",
        xml: loopXMLString,
      },
      {
        name: "My Blocks",
        xml: functionXMLString,
      },
      {
        name: "Variables",
        xml: variablesXMLString,
      },
      {
        name: "List",
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
        xml: colorXMLString,
      },
      {
        name: "Math",
        xml: mathXMLString,
      },
      {
        name: "Text",
        xml: textXMLString,
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
        xml: arduinoXMLString,
      },
      {
        name: "Message",
        xml: messageXMLString,
      },
      {
        name: "Time",
        xml: timeXMLString,
      },
    ],
  },
  {
    color: COLOR_THEME.COMPONENTS,
    category: ToolBoxCategory.COMPONENT,
    name: "Components",
    toolBoxEntries: [
      { name: "Bluetooth", xml: bluetoothXMLString },
      { name: "Digital Display", xml: digitalDisplayXMLString },
      { name: "LCD Screen", xml: lcdScreenXMLString },
      { name: "Led", xml: ledXMLString },
      { name: "Led Matrix", xml: ledMatrixXMLString },
      { name: "Motor", xml: motorXMLString },
      { name: "Neo Pixel", xml: neoPixelXMLString },
      { name: "Passive Buzzer", xml: passiveBuzzerXMLString },
      { name: "Pins", xml: writePinXMLString },
      { name: "RBG Led", xml: rgbLedXMLString },
      { name: "Servos", xml: servoXMLString },
      { name: "Stepper Motors", xml: stepperMotorXMLString },
    ],
  },
  {
    color: COLOR_THEME.SENSOR,
    category: ToolBoxCategory.SENSORS,
    name: "Sensors",
    toolBoxEntries: [
      { name: "Analog", xml: analogSensorXMLString },
      { name: "Button", xml: buttonXMLString },
      { name: "Digital Sensor", xml: digitalSensorXMLString },
      { name: "IR Remote", xml: irRmoteXMLString },
      { name: "JoyStick", xml: joystickXMLString },
      { name: "Motion Sensor", xml: ultraSonicXMLString },
      { name: "RFID", xml: rfidXMLString },
      { name: "Temperature/Humidity", xml: temperatureXMLString },
      { name: "Thermistor", xml: thermistorXMLString },
    ],
  },
];

export const getToolBoxString = (): string => {
  const toolboxOptions = defaultToolbox; // TODO Make this dynamic
  let toolbox = `<xml
    xmlns="https://developers.google.com/blockly/xml"
    id="toolbox-simple"
    style="display: none"
  >`;

  toolbox += toolboxOptions.reduce((acc, next) => {
    if (next.category === ToolBoxCategory.NONE) {
      return acc + getMenuItems(next.toolBoxEntries);
    }

    return (
      acc +
      `<category name="${next.name}" colour="${next.color}">
        ${getMenuItems(next.toolBoxEntries)}
      </category>`
    );
  }, "");

  toolbox += `</xml>`;

  return toolbox;
};

function getMenuItems(toolBoxEntries: ToolBoxEntry[]) {
  return toolBoxEntries.reduce((acc, next) => {
    return acc + next.xml;
  }, "");
}
