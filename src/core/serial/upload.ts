import { ProgramConfig, upload } from "@duinoapp/upload-multitool";
import { WebSerialPort } from "@duinoapp/upload-multitool";
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
    console.log("Compilation successful, hex data length:", result.length);
    return result;
  } catch (error) {
    console.error("Code compilation error:", error);
    throw error;
  }
};

// Global port tracking to prevent multiple open attempts
let currentPort: WebSerialPort | null = null;
export const arduinoUploader = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  
  let serialport: WebSerialPort | null = null;

  try {
    const hexCode = await compileCode(code, type);
    const processedHex = processHexData(hexCode);

    if (!processedHex || !processedHex.startsWith(":")) {
      throw new Error("Invalid hex data received from server");
    }

    console.log("Hex data is valid, requesting port...");

    if (!WebSerialPort.isSupported()) {
      throw new Error("Web Serial API is not supported in this environment");
    }

    if (!currentPort) {
      serialport = await WebSerialPort.requestPort({}, { baudRate: 9600 });
      if (!serialport) throw new Error("No serial port selected.");
      currentPort = serialport;
    } else {
      serialport = currentPort;
    }

    if (!serialport.port || !serialport.port.isOpen) {
      try {
        await serialport.open();
        console.log("Serial port opened successfully");
      } catch (portError) {
        throw new Error(`Failed to open port: ${portError.message}`);
      }
    }

    // Directly use serialport.port without casting
    const config = {
      bin: processedHex,
      // files: filesData,
      // flashFreq: flashFreqData,
      // flashMode: flashModeData,
      speed: 9600,
      uploadSpeed: 9600,
      tool: "avr",
      cpu: "atmega328p",
      stdout: console.log,
      verbose: true,
    } as any as ProgramConfig;

    console.log("\r\nUploading...\r\n");

    const res = await upload(serialport.port, config); // Use serialport.port directly
    console.log("Upload successful");
    currentPort = serialport; // Ensure currentPort remains of type WebSerialPort
    return "Upload successful";
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Upload failed: " + error.message);
  } finally {
    if (serialport && serialport.port?.isOpen) {
      try {
        await serialport.close();
        console.log("Serial port closed");
        currentPort = null;
      } catch (closeError) {
        console.warn("Warning: Error closing port:", closeError);
      }
    }
  }
};
// Function to process hex data
function processHexData(hexData: string): string {
  const lines = hexData.trim().split(/\r?\n/);
  const processedLines = lines.map((line) => {
    if (!line.trim().startsWith(":")) {
      return ":" + line.trim();
    }
    return line.trim();
  });
  return processedLines.join("\n");
}
