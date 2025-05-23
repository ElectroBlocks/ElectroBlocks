import {
  ProgramConfig,
  upload,
  WebSerialPortPromise,
} from "@duinoapp/upload-multitool";
import { get, writable } from "svelte/store";
import { ArduinoMessage } from "./arduino-message.store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";
import hexCode from "../core/serial/arduino/arduino-firmware.hex?raw";
const arduinoPortStore = writable<WebSerialPortPromise | null>(null);

const usbMessageStore = writable<ArduinoMessage>();

const portStateStore = writable<string>("disconnected");

let buffer = "";

export const portStateStoreSub = {
  subscribe: portStateStore.subscribe,
};

function addListener(port: WebSerialPortPromise) {
  port.on("data", (data) => {
    buffer += data.toString();

    // Split on newlines
    const lines = buffer.split("\n");

    // Emit all complete lines
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim(); // Clean \r if present

      if (!line) continue;

      usbMessageStore.set({
        message: line,
        type: "Arduino",
        id: Date.now() + "_" + Math.random().toString(),
        time: new Date().toLocaleTimeString(),
      });
      console.log("Received complete message:", line);
    }

    // Keep last incomplete part in buffer
    buffer = lines[lines.length - 1];
  });
}

export default {
  subscribe: arduinoPortStore.subscribe,
  connectWithAndUploadFirmware: async (boardType: MicroControllerType) => {
    try {
      portStateStore.set("connecting");
      const port = await WebSerialPortPromise.requestPort(
        {},
        { baudRate: 115200 }
      );
      addListener(port);

      await port.open();
      arduinoPortStore.set(port);

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

      portStateStore.set("connected");
    } catch (error) {
      console.log(error);

      if (error.message == "receiveData timeout after 400ms") {
        setTimeout(() => {
          var lastMessage = get(usbMessageStore);
          if (lastMessage?.message.includes("System")) {
            portStateStore.set("connected");
            return;
          }
          portStateStore.set("disconnected");
          arduinoPortStore.set(null);
        }, 200);
        return;
      }
      portStateStore.set("disconnected");
      arduinoPortStore.set(null);
    }
  },
  connect: async () => {
    try {
      portStateStore.set("connecting");
      const port = await WebSerialPortPromise.requestPort(
        {},
        { baudRate: 115200 }
      );
      await port.open();
      portStateStore.set("connected");
      addListener(port);
      arduinoPortStore.set(port);
    } catch (error) {
      portStateStore.set("disconnected");
    }
  },
  disconnect: async () => {
    const port = await get(arduinoPortStore);
    if (port) {
      await port.close();
    }
    arduinoPortStore.set(null);
    portStateStore.set("disconnected");
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
      await port.write(message);
      console.log("Sent:", message);
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
};
