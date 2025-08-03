import {
  ProgramConfig,
  upload,
  WebSerialPortPromise,
} from "@duinoapp/upload-multitool";
import { get, writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";
import arduinoUnoHexCode from "../core/serial/arduino/arduino-firmware.hex?raw";
import { onErrorMessage } from "../help/alerts";
import { ArduinoFrame } from "../core/frames/arduino.frame";

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

function addListener(port: WebSerialPortPromise) {
  port.removeAllListeners();
  port.on("data", (data) => {
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
  try {
    portStateStore.set(PortState.CONNECTING);
    const port = await WebSerialPortPromise.requestPort(
      {},
      { baudRate: 115200 }
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
      uploadSpeed: 115200,

      tool: boardType == MicroControllerType.ESP32 ? "esptool" : "avrdude",
      cpu: "atmega328p",
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
    onErrorMessage("Error Uploading Code", error);
  }
};

const compileCode = async (code: string, type: string): Promise<string> => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
  });
  try {
    ///
    var jsonString = {
      fqbn: "arduino:avr:uno",
      files: [
        {
          content: code,
          name: "arduino/arduino.ino",
        },
      ],
      flags: { verbose: false, preferLocal: false },
      libs: [],
    };

    console.log(`Sending code to https://compile.duino.app/v3/compile`);
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
  uploadCode: async (boardType: MicroControllerType, code: string) => {
    await uploadHexCodeToBoard(boardType, async () => {
      return await compileCode(code, boardType);
    });
  },

  connectWithAndUploadFirmware: async (boardType: MicroControllerType) => {
    await uploadHexCodeToBoard(boardType, async () => arduinoUnoHexCode);
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
    } catch (error) {
      portStateStore.set(PortState.CLOSE);
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
  while (!arduinoStore.getLastMessage().includes(command)) {
    console.log("waiting for message");
    await new Promise((resolve) => setTimeout(resolve, 10));
    count++;
    if (count > 100) {
      console.info("Timeout waiting for command:", command);
      return;
    }
  }
  console.log("DONE_WAITING", new Date().getTime());
  return;
};

export async function senseDataArduino() {
  if (!arduinoStore.isConnected()) {
    console.error("Port is not connected");
    return "";
  }
  await arduinoStore.sendMessage("sense|");
  await waitForCommand("DONE_NEXT_COMMAND");
  let sensorMessage = arduinoStore.getLastSensorMessage();
  sensorMessage = sensorMessage.replace("SENSE_COMPLETE", "");
  return sensorMessage;
}

export async function restartArduino() {
  if (!arduinoStore.isConnected()) {
    console.error("Port is not connected");
    return "";
  }
  await arduinoStore.sendMessage("restart:|");
  await waitForCommand("System:READY");
}

export const setupComponents = async (frame: ArduinoFrame) => {
  let setupMessage = frame.components.reduce((acc, component) => {
    if (component?.setupCommand === undefined) {
      return acc;
    }
    return acc + component?.setupCommand + ";";
  }, "");
  console.log(setupMessage, "pre-test");
  if (setupMessage === "") {
    return;
  }
  console.log("setupMessage", setupMessage);
  arduinoStore.sendMessage(setupMessage);

  await waitForCommand("DONE_NEXT_COMMAND");
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
  let usbMessage = frame.components.reduce((acc, component) => {
    if (
      component?.usbCommands === undefined ||
      component?.usbCommands.length === 0
    ) {
      return acc;
    }

    return acc + component?.usbCommands.join(";");
  }, "");
  if (usbMessage === "") {
    return;
  }

  arduinoStore.sendMessage(usbMessage);

  await waitForCommand("DONE_NEXT_COMMAND");
};