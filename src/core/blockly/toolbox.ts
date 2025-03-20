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
import { MicrocontrollerType } from "../../core/microcontroller/microcontroller";
import { SUPPORTED_LANGUAGES } from "../../core/microcontroller/microcontroller";

export interface ToolBoxEntries {
  category: ToolBoxCategory;
  name: string;
  toolBoxEntries: ToolBoxEntry[];
  color: COLOR_THEME;
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
  supportedBoards: MicrocontrollerType[];
  supportedLanguages: string[];
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
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Loop",
        xml: loopXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO, MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "My Blocks",
        xml: functionXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO, MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Variables",
        xml: variablesXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO, MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "List",
        xml: listXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Color",
        xml: colorXMLString,
        supportedBoards: [MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Math",
        xml: mathXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Text",
        xml: textXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Code",
        xml: arduinoXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Message",
        xml: messageXMLString,
        supportedBoards: [MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Time",
        xml: timeXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
    ],
  },
  {
    color: COLOR_THEME.COMPONENTS,
    category: ToolBoxCategory.COMPONENT,
    name: "Add-ons",
    toolBoxEntries: [
      {
        name: "Bluetooth",
        xml: bluetoothXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON, SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Digital Display",
        xml: digitalDisplayXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "FastLED",
        xml: fastLEDXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "LCD Screen",
        xml: lcdScreenXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Led",
        xml: ledXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Led Matrix",
        xml: ledMatrixXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Motor",
        xml: motorXMLString,
        supportedBoards: [MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Passive Buzzer",
        xml: passiveBuzzerXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Pins",
        xml: writePinXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "RGB Led",
        xml: rgbLedXMLString,
        supportedBoards: [MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Servos",
        xml: servoXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Stepper Motors",
        xml: stepperMotorXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
    ],
  },
  {
    color: COLOR_THEME.SENSOR,
    category: ToolBoxCategory.SENSORS,
    name: "Sensors",
    toolBoxEntries: [
      {
        name: "Analog",
        xml: analogSensorXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Button",
        xml: buttonXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Digital Sensor",
        xml: digitalSensorXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA, MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "IR Remote",
        xml: irRmoteXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO, MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "JoyStick",
        xml: joystickXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Motion Sensor",
        xml: ultraSonicXMLString,
        supportedBoards: [MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "RFID",
        xml: rfidXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_UNO],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
      {
        name: "Temperature/Humidity",
        xml: temperatureXMLString,
        supportedBoards: [MicrocontrollerType.ESP32],
        supportedLanguages: [SUPPORTED_LANGUAGES.PYTHON],
      },
      {
        name: "Thermistor",
        xml: thermistorXMLString,
        supportedBoards: [MicrocontrollerType.ARDUINO_MEGA],
        supportedLanguages: [SUPPORTED_LANGUAGES.C],
      },
    ],
  },
];
