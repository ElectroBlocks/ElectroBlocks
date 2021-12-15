import { writable } from "svelte/store";
import { wait } from "../helpers/wait";
import { SerialPort } from "../core/serial/avrgirl-serial";
export interface ArduinoMessage {
  type: "Arduino" | "Computer";
  message: string;
  id: string;
  time: string;
}

let serialPort: SerialPort;
const arduinoMessageStore = writable<ArduinoMessage>(undefined);

const onMessage = (message: string) => {
  arduinoMessageStore.set({
    message,
    type: "Arduino",
    id: new Date().getTime() + "_" + Math.random().toString(),
    time: new Date().toLocaleTimeString(),
  });
  wait(20);
};

const connect = async (baudRate) => {
  serialPort = new SerialPort(
    {
      requestOptions: {
        // Filter on devices with the Arduino USB vendor ID.
        // filters: [{ usbVendorId: 0x2341 }], // todo mega arduino
      },
      baudRate,
    },
    onMessage
  );
  return new Promise((res, rej) => {
    serialPort.open((err) => {
      console.log(err);
      if (!err) {
        res(undefined);
        return;
      }
      rej(err);
    });
  });
};

const closePort = async () => {
  await serialPort.close((info) => console.log("closed", info));
};

const sendMessage = async (message: string) => {
  await serialPort.write(message, (err) => {
    if (err) {
      console.log(err, "sendmessage");
    }
    arduinoMessageStore.set({
      message,
      type: "Computer",
      id: new Date().getTime() + "_" + Math.random().toString(),
      time: new Date().toLocaleTimeString(),
    });
  });
};

export default {
  subscribe: arduinoMessageStore.subscribe,
  connect,
  closePort,
  sendMessage,
};
