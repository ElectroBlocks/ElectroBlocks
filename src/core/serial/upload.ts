import { ProgramConfig, upload, WebSerialPortPromise } from "@duinoapp/upload-multitool";
import config from "../../env";
import { MicroControllerType } from "../microcontroller/microcontroller";

const compileCode = async (code: string, type: string): Promise<string> => {
  const headers = new Headers({ "Content-Type": "text/plain" });
  try {
    console.log(`Sending code to ${config.server_arduino_url}/upload-code/${type}`);
    const response = await fetch(
      `${config.server_arduino_url}/upload-code/${type}`,
      { method: "POST", body: code, headers }
    );
    if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
    const result = await response.text();
    return btoa(result);
  } catch (error) {
    console.error("Code compilation error:", error);
    throw error;
  }
};


export const arduinoUploader = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  let serialport: WebSerialPortPromise | null = null;
  try {
    const hexCode = await compileCode(code, type);
    console.log("requesting port...");
    if (!WebSerialPortPromise.isSupported()) {
      throw new Error("Web Serial API is not supported in this environment");
    }
      serialport = await WebSerialPortPromise.requestPort({}, { baudRate: 115200 });
      if (!serialport) throw new Error("No serial port selected.");
    if (!serialport.isOpen) {
      try {
        await serialport.open();
        console.log("Serial port opened successfully");
      } catch (portError) {
        throw new Error(`Failed to open port: ${portError.message}`);
      }
    }
    const config = {
      bin: hexCode,
      // files: filesData,
      // flashFreq: flashFreqData,
      // flashMode: flashModeData,
      speed:  115200,
      uploadSpeed:115200,
      tool: "avr",
      cpu: "atmega328p",
      stdout: {
        write: (msg: string) => console.log(msg), // Properly implement the write method
      },
      verbose: true,
    } as any as ProgramConfig;
    await upload(serialport.port, config);
 
    return "Upload successful";
 
  } finally {
    if (serialport) {
      try {
        await serialport.close();
        console.log("Serial port closed");
     
      } catch (closeError) {
        console.warn("Warning: Error closing port:", closeError);
      }
    }
  }
};

