import {
  ProgramConfig,
  upload,
  WebSerialPortPromise,
} from "@duinoapp/upload-multitool";
import { get, writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";
import arduinoUnoHexCode from "../core/serial/arduino/arduino-uno-firmware.hex?raw";
import arduinoMegaHexCode from "../core/serial/arduino/arduino-mega-firmware.hex?raw";
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
    console.log(config);
    debugger;
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
    var jsonString = {
      fqbn:
        type == MicroControllerType.ARDUINO_UNO
          ? "arduino:avr:uno"
          : "arduino:avr:mega",
      files: [
        {
          content: code,
          name: "arduino/arduino.ino",
        },
      ],
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

  connectWithAndUploadFirmware: async (boardType: MicroControllerType) => {
    if (!arduinoStore.isConnected()) {
      await arduinoStore.connect();
    }
    const successfulRestart = await restartArduino();
    if (successfulRestart) return "restarted";
    await uploadHexCodeToBoard(boardType, async () =>
      boardType == MicroControllerType.ARDUINO_UNO
        ? arduinoUnoHexCode
        : arduinoMegaHexCode
    );
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

const waitForCommand = async (command: string) => {
  arduinoStore.clearMessages();
  var count = 0;
  let lastMessage = arduinoStore.getLastMessage();
  while (!lastMessage.includes(command)) {
    if (lastMessage.includes("ERR")) {
      throw new Error("Error handling usb command");
    }
    console.log("waiting for message");
    await new Promise((resolve) => setTimeout(resolve, 10));
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
      arduinoStore.sendMessage(usbCommand);

      await waitForCommand("OK");
    }
  }
};