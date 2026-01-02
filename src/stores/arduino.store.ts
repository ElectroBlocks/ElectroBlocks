import {
  ProgramConfig,
  upload,
  WebSerialPortPromise,
} from "@duinoapp/upload-multitool";
import { get, writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

import firmware from "../core/serial/arduino/firmware.ino?raw";
import LedMatrixH from "../core/serial/arduino/LedMatrix.h?raw";
import LedMatrixCPP from "../core/serial/arduino/LedMatrix.cpp?raw";
import RfidParserH from "../core/serial/arduino/rfid_parser.h?raw";

import { onErrorMessage } from "../help/alerts";
import { ArduinoFrame, Library } from "../core/frames/arduino.frame";
import { getBoard } from "../core/microcontroller/selectBoard";

export enum PortState {
  OPEN = "Open",
  CLOSE = "Close",
  CONNECTING = "Connecting",
  UPLOADING = "Uploading",
}

const arduinoPortStore = writable<WebSerialPortPromise | null>(null);

export const usbMessageStore = writable<ArduinoMessage>();
export const sensorMessages = writable<ArduinoMessage>();

const portStateStore = writable<PortState>(PortState.CLOSE);

let buffer = "";

export const portStateStoreSub = {
  subscribe: portStateStore.subscribe,
};

export interface ArduinoMessage {
  type: "Arduino" | "Computer";
  message: string;
  id: string;
  time: string;
}

export enum SimulatorMode {
  LIVE = "LIVE",
  VIRTUAL = "VIRTUAL",
}

export const simulatorStore = writable<SimulatorMode>(SimulatorMode.VIRTUAL);

function addListener(port: WebSerialPortPromise) {
  port.removeAllListeners();
  port.on("data", (data) => {
    if (get(portStateStoreSub) != PortState.OPEN) return;
    buffer += data.toString();

    // Split on newlines
    const lines = buffer.split("\n");

    // Emit all complete lines
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim(); // Clean \r if present

      if (!line) continue;

      if (line.includes("SENSE_COMPLETE")) {
        sensorMessages.set({
          message: line,
          type: "Arduino",
          id: Date.now() + "_" + Math.random().toString(),
          time: new Date().toLocaleTimeString(),
        });
      }

      usbMessageStore.set({
        message: line,
        type: "Arduino",
        id: Date.now() + "_" + Math.random().toString(),
        time: new Date().toLocaleTimeString(),
      });

      console.log("Received complete message:", line, new Date().getTime());
    }

    // Keep last incomplete part in buffer
    buffer = lines[lines.length - 1];
  });
}

const uploadHexCodeToBoard = async (
  boardType: MicroControllerType,
  getHexCode: () => Promise<string>
) => {
  const boardInfo = getBoard(boardType);
  try {
    portStateStore.set(PortState.CONNECTING);
    let port = get(arduinoPortStore);
    port = port
      ? port
      : await WebSerialPortPromise.requestPort(
          {},
          { baudRate: boardInfo.serial_baud_rate }
        );

    if (!port.isOpen) {
      await port.open();
    }

    arduinoPortStore.set(port);
    const hexCode = await getHexCode();
    const config = {
      bin: hexCode,
      // files: filesData,
      // flashFreq: flashFreqData,
      // flashMode: flashModeData,
      speed: 115200,
      uploadSpeed: boardInfo.serial_baud_rate,
      tool: "avrdude",
      cpu:
        boardType == MicroControllerType.ARDUINO_UNO
          ? "atmega328p"
          : "atmega2560",
      stdout: {
        write: (msg: string) => console.log(msg), // Properly implement the write method
      },
      verbose: true,
    } as any as ProgramConfig;
    await upload(port, config);
    addListener(port);
    portStateStore.set(PortState.OPEN);
  } catch (error) {
    console.log(error);

    if (error.message == "receiveData timeout after 400ms") {
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        var lastMessage = get(usbMessageStore);
        console.log("Last message:", lastMessage);
        if (lastMessage?.message.includes("System")) {
          portStateStore.set(PortState.OPEN);
          return;
        }
      }
    }
    portStateStore.set(PortState.CLOSE);
    arduinoPortStore.set(null);
    throw error;
    // onErrorMessage("Error Uploading Code", error);
  }
};

const compileCode = async (
  code: string,
  type: MicroControllerType,
  libraries: Library[]
): Promise<string> => {
  // TODO sub type in
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
  });
  try {
    ///
    var files = [
      {
        content: code,
        name: "arduino/arduino.ino",
      },
    ];
    // If there is another come up with a standard way of doing this.
    if (libraries.find((x) => x.name == "LedControl")) {
      files.push({
        name: "arduino/LedMatrix.h",
        content: LedMatrixH,
      });
      files.push({
        name: "arduino/LedMatrix.cpp",
        content: LedMatrixCPP,
      });
    }

    var jsonString = {
      fqbn:
        type == MicroControllerType.ARDUINO_UNO
          ? "arduino:avr:uno"
          : "arduino:avr:mega",
      files,
      flags: { verbose: false, preferLocal: false },
      libs: libraries,
    };

    console.log(
      `Sending code to https://compile.duino.app/v3/compile`,
      jsonString
    );
    const response = await fetch(`https://compile.duino.app/v3/compile`, {
      method: "POST",
      body: JSON.stringify(jsonString),
      headers,
    });
    if (!response.ok)
      throw new Error(`Server responded with status: ${response.status}`);
    const result = await response.json();
    return result.hex;
  } catch (error) {
    console.error("Code compilation error:", error);
    onErrorMessage("Error compiling code", error);
  }
};

const arduinoStore = {
  subscribe: arduinoPortStore.subscribe,
  uploadCode: async (
    boardType: MicroControllerType,
    code: string,
    libraries: Library[]
  ) => {
    await uploadHexCodeToBoard(boardType, async () => {
      return await compileCode(code, boardType, libraries);
    });
  },

  connectWithAndUploadFirmware: async (
    boardType: MicroControllerType,
    enableFlags: string[]
  ) => {
    if (!arduinoStore.isConnected()) {
      await arduinoStore.connect();
    }

    const libraries = [
      {
        name: "Servo",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/arduino-libraries/Servo-1.2.1.zip",
      },
      {
        name: "LiquidCrystal I2C",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/marcoschwartz/LiquidCrystal_I2C-1.1.2.zip",
      },
      {
        name: "Stepper",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/arduino-libraries/Stepper-1.1.3.zip",
      },
      {
        name: "Adafruit NeoPixel",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/adafruit/Adafruit_NeoPixel-1.12.0.zip",
      },
      {
        name: "LedControl",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/wayoda/LedControl-1.0.6.zip",
      },
      {
        name: "TM1637 Driver",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/AKJ7/TM1637_Driver-2.2.1.zip",
      },
      {
        name: "IRLremote",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/NicoHood/IRLremote-2.0.2.zip",
      },
      {
        name: "DHT sensor library",
        version: "latest",
        deps: ["Adafruit Unified Sensor"],
        url: "https://downloads.arduino.cc/libraries/github.com/adafruit/DHT_sensor_library-1.4.6.zip",
      },
      {
        name: "Adafruit Unified Sensor",
        version: "latest",
        url: "https://downloads.arduino.cc/libraries/github.com/adafruit/Adafruit_Unified_Sensor-1.1.14.zip",
      },
    ];

    let firmwareCode = firmware;
    const availableEnableFlags = [
      "ENABLE_BUZZER",
      "ENABLE_SERVO",
      "ENABLE_LCD",
      "ENABLE_LED_STRIP",
      "ENABLE_DHT",
      "ENABLE_LED_MATRIX",
      "ENABLE_IR_REMOTE",
      "ENABLE_RFID_UART",
      "ENABLE_STEPPER",
      "ENABLE_TM",
      "ENABLE_MOTOR",
    ];
    for (let flag of availableEnableFlags) {
      const enabled = enableFlags.includes(flag);
      firmwareCode = firmwareCode.replace(
        "REPLACE_" + flag,
        enabled ? "1" : "0"
      );
    }

    const files = [
      {
        content: firmwareCode,
        name: "firmware/firmware.ino",
      },
      {
        content: RfidParserH,
        name: "firmware/rfid_parser.h",
      },
      {
        content: LedMatrixCPP,
        name: "firmware/LedMatrix.cpp",
      },
      {
        content: LedMatrixH,
        name: "firmware/LedMatrix.h",
      },
    ];

    const headers = new Headers({
      "Content-Type": "application/json; charset=utf-8",
    });

    var jsonString = {
      fqbn:
        boardType == MicroControllerType.ARDUINO_UNO
          ? "arduino:avr:uno"
          : "arduino:avr:mega",
      files,
      flags: { verbose: false, preferLocal: false },
      libs: libraries,
    };

    console.log(
      `Sending code to https://compile.duino.app/v3/compile`,
      jsonString
    );

    await uploadHexCodeToBoard(boardType, async () => {
      const response = await fetch(`https://compile.duino.app/v3/compile`, {
        method: "POST",
        body: JSON.stringify(jsonString),
        headers,
      });
      if (!response.ok)
        throw new Error(`Server responded with status: ${response.status}`);
      const result = await response.json();
      return result.hex;
    });

    return "full upload";
  },
  connect: async () => {
    try {
      portStateStore.set(PortState.CONNECTING);
      const port = await WebSerialPortPromise.requestPort(
        {},
        { baudRate: 115200 }
      );
      await port.open();
      portStateStore.set(PortState.OPEN);
      addListener(port);
      arduinoPortStore.set(port);
      return true;
    } catch (error) {
      portStateStore.set(PortState.CLOSE);
      return false;
    }
  },
  disconnect: async () => {
    const port = await get(arduinoPortStore);
    if (port) {
      await port.close();
    }
    arduinoPortStore.set(null);
    portStateStore.set(PortState.CLOSE);
  },
  isConnected: () => {
    const port = get(arduinoPortStore);
    return port !== null && port.isOpen;
  },
  getPortState: () => {
    const portState = get(portStateStore);
    return portState;
  },
  sendMessage: async (message: string) => {
    const port = await get(arduinoPortStore);
    if (port) {
      await port.write(message + "|");
      console.log("Sent:", message, new Date().getTime());
      usbMessageStore.set({
        message,
        type: "Computer",
        id: new Date().getTime() + "_" + Math.random().toString(),
        time: new Date().toLocaleTimeString(),
      });
    } else {
      console.error("Port is not connected");
    }
  },
  clearMessages: () => {
    usbMessageStore.set(null);
  },
  arduinoMessages: usbMessageStore.subscribe,
  getLastMessage: () => {
    return get(usbMessageStore)?.message ?? "";
  },
  getLastSensorMessage: () => {
    return get(sensorMessages)?.message ?? "";
  },
};

export default arduinoStore;

const waitForCommand = async (command: string, waitInMs: number = 10) => {
  arduinoStore.clearMessages();
  var count = 0;
  let lastMessage = arduinoStore.getLastMessage();
  while (!lastMessage.includes(command)) {
    if (lastMessage.includes("ERR")) {
      throw new Error("Error handling usb command");
    }
    console.log("waiting for message");
    await new Promise((resolve) => setTimeout(resolve, waitInMs));
    count++;
    if (count > 100) {
      console.info("Timeout waiting for command:", command);
      return false;
    }
    lastMessage = arduinoStore.getLastMessage();
  }
  console.log("DONE_WAITING", new Date().getTime());
  return true;
};

export async function senseDataArduino() {
  if (!arduinoStore.isConnected()) {
    console.error("Port is not connected");
    return "";
  }
  await arduinoStore.sendMessage("sense");
  await waitForCommand("OK");
  let sensorMessage = arduinoStore.getLastSensorMessage();
  sensorMessage = sensorMessage.replace("SENSE_COMPLETE", "");
  return sensorMessage;
}

export async function restartArduino() {
  if (!arduinoStore.isConnected()) {
    console.error("Port is not connected");
    return false;
  }
  await arduinoStore.sendMessage("restart|");
  return await waitForCommand("System:READY");
}

export const setupComponents = async (frame: ArduinoFrame) => {
  for (var component of frame.components) {
    console.log("setupMessage", component.setupCommand);
    arduinoStore.sendMessage(component.setupCommand);

    await waitForCommand("OK");
  }
};

export const updateComponents = async (frame: ArduinoFrame) => {
  if (arduinoStore.isConnected() === false) {
    console.info("Port is not connected");
    return;
  }
  if (frame?.components === undefined) {
    console.info("No components found");
    return;
  }

  for (var component of frame.components) {
    if (!component.usbCommands) break;
    for (var usbCommand of component.usbCommands) {
      console.log(`SENDING: ${usbCommand}`);
      if (typeof usbCommand == "string") {
        arduinoStore.sendMessage(usbCommand);
        await waitForCommand("OK");
      } else {
        arduinoStore.sendMessage(usbCommand.command);
        await waitForCommand("OK", usbCommand.waitInMs);
      }
    }
  }
};