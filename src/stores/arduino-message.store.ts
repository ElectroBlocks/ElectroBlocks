import { writable } from "svelte/store";
import selectedBoard from "../core/blockly/selectBoard";
import { LineBreakTransformer } from "../core/serial/linebreak.transformer";

export interface ArduinoMessage {
  type: "Arduino" | "Computer";
  message: string;
  id: string;
  time: string;
}

let port;
let writer: WritableStreamDefaultWriter | undefined;
let reader: ReadableStreamDefaultReader | undefined;
const arduinoMessageStore = writable<ArduinoMessage>(undefined);

const connect = async (newPort: any) => {
  await closePort();
  port = newPort;
  await port.open({ baudrate: selectedBoard().serial_baud_rate });

  // Link https://codelabs.developers.google.com/codelabs/web-serial/#6
  // Writing Section
  const encoder = new TextEncoderStream();
  encoder.readable.pipeTo(port.writable);
  writer = encoder.writable.getWriter();

  // Reading from Arduino Section
  let decoder = new TextDecoderStream();
  port.readable.pipeTo(decoder.writable);
  // Open and begin reading.
  reader = decoder.readable
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
  // Listen to data coming from the serial device.
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    arduinoMessageStore.set({
      message: value,
      type: "Arduino",
      id: new Date().getTime() + "_" + Math.random().toString(),
      time: new Date().toLocaleTimeString(),
    });
  }
};

const sendMessage = (message: string) => {
  if (writer) {
    writer.write(message);
    arduinoMessageStore.set({
      message: message,
      type: "Computer",
      id: new Date().getTime() + "_" + Math.random().toString(),
      time: new Date().toLocaleTimeString(),
    });
  }
};

const closePort = async () => {
  if (port) {
    await writer.close();
    await reader.cancel();
    await port.close();
    port = null;
    writer = null;
    reader = null;
  }
};

export default {
  subscribe: arduinoMessageStore.subscribe,
  connect,
  closePort,
  sendMessage,
};
