import _ from "lodash";
import bluetoothXMLString from "../../blocks/bluetooth/toolbox";
import buttonXMLString from "../../blocks/button/toolbox";
import irRmoteXMLString from "../../blocks/ir_remote/toolbox";
import neoPixelXMLString from "../../blocks/neopixels/toolbox";
import fastLEDXMLString from "../../blocks/fastled/toolbox";
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
import { MicroControllerType } from "../../core/microcontroller/microcontroller";
import { SUPPORTED_LANGUAGES } from "../../core/microcontroller/microcontroller";

export interface ToolBoxEntries {
  category: ToolBoxCategory;
  name: string;
  toolBoxEntries: ToolBoxEntry[];
  color: COLOR_THEME;
  supportedLanguages: SUPPORTED_LANGUAGES[];
}

export enum ToolBoxCategory {
  COMPONENT = "Component",
  SENSORS = "Sensors",
  ARDUINO = "Arduino",
  DATA = "DATA",
  NONE = "NONE",
  SEPARATOR = "SEPARATOR",
}

export interface ToolBoxEntry {
  name: string;
  xml: string;
  supportedBoards: MicroControllerType[];
  supportedLanguages: SUPPORTED_LANGUAGES[];
}

const defaultToolbox: ToolBoxEntries[] = [
  {
    color: COLOR_THEME.CONTROL,
    category: ToolBoxCategory.NONE,
    supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
    name: "TOP_LEVEL",
    toolBoxEntries: [
      {
        name: "Logic",
        xml: logicXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Loop",
        xml: loopXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "My Blocks",
        xml: functionXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Variables",
        xml: variablesXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "List",
        xml: listXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Color",
        xml: colorXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Math",
        xml: mathXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_MEGA,
          MicroControllerType.ARDUINO_UNO,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Text",
        xml: textXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Code",
        xml: arduinoXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Message",
        xml: messageXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Time",
        xml: timeXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C, SUPPORTED_LANGUAGES.PYTHON],
      },
    ],
  },
  {
    color: COLOR_THEME.COMPONENTS,
    supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
    category: ToolBoxCategory.COMPONENT,
    name: "Add-ons",
    toolBoxEntries: [
      {
        name: "Bluetooth",
        xml: bluetoothXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Digital Display",
        xml: digitalDisplayXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "FastLED",
        xml: fastLEDXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "LCD Screen",
        xml: lcdScreenXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C, SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Led",
        xml: ledXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Led Matrix",
        xml: ledMatrixXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Motor",
        xml: motorXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Passive Buzzer",
        xml: passiveBuzzerXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Pins",
        xml: writePinXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "RGB Led",
        xml: rgbLedXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Servos",
        xml: servoXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Stepper Motors",
        xml: stepperMotorXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
    ],
  },
  {
    color: COLOR_THEME.SENSOR,
    category: ToolBoxCategory.SENSORS,
    supportedLanguages: [SUPPORTED_LANGUAGES.C],
    name: "Sensors",
    toolBoxEntries: [
      {
        name: "Analog",
        xml: analogSensorXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Button",
        xml: buttonXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Digital Sensor",
        xml: digitalSensorXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "IR Remote",
        xml: irRmoteXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "JoyStick",
        xml: joystickXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Motion Sensor",
        xml: ultraSonicXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "RFID",
        xml: rfidXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Temperature/Humidity",
        xml: temperatureXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Thermistor",
        xml: thermistorXMLString,
        supportedBoards: [
          MicroControllerType.ARDUINO_UNO,
          MicroControllerType.ARDUINO_MEGA,
        ],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
    ],
  },
];
export const getToolBoxString = (
  board: MicroControllerType,
  lang: SUPPORTED_LANGUAGES
): string => {
  const toolboxOptions = defaultToolbox; // TODO Make this dynamic
  let toolbox = `<xml
    xmlns="https://developers.google.com/blockly/xml"
    id="toolbox-simple"
    style="display: none"
  >`;

  toolbox += toolboxOptions.reduce((acc, next) => {
    if (!next.supportedLanguages.includes(lang)) {
      return acc;
    }

    if (next.category === ToolBoxCategory.NONE) {
      return acc + getMenuItems(next.toolBoxEntries, board, lang);
    }

    return (
      acc +
      `<category name="${next.name}" colour="${next.color}">
        ${getMenuItems(next.toolBoxEntries, board, lang)}
      </category>`
    );
  }, "");

  toolbox += `</xml>`;

  return toolbox;
};

function getMenuItems(
  toolBoxEntries: ToolBoxEntry[],
  board: MicroControllerType,
  lang: SUPPORTED_LANGUAGES
) {
  return toolBoxEntries.reduce((acc, next) => {
    if (
      next.supportedLanguages.includes(lang) &&
      next.supportedBoards.includes(board)
    ) {
      return acc + next.xml;
    }
    return acc;
  }, "");
}
