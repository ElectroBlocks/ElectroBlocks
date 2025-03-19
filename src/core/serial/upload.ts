import { MicroControllerType } from "../microcontroller/microcontroller";
import config from "../../env";
import  upload  from '@duinoapp/upload-multitool';
import  SerialPort  from 'serialport';


async function getAvailablePorts() {
    try {
        const ports = await SerialPort.SerialPort.list();

        if (ports.length === 0) {
            console.log("No serial ports found!");
            return [];
        }

        console.log("Available Serial Ports:");
        ports.forEach((port, index) => {
            console.log(`${index + 1}. Path: ${port.path}, Manufacturer: ${port.manufacturer || "Unknown"}`);
        });

        return ports;
    } catch (error) {
        console.error("Error listing serial ports:", error);
        return [];
    }
}

export const arduinoUploader = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  const selectedPort = await getAvailablePorts();
  const serialport = new SerialPort.SerialPort({ path: selectedPort[0]?.path, baudRate: 115200 });
  const hexCode = await compileCode(code, type);
  let hexData, filesData, flashFreqData, flashModeData;

  try {
    
    hexData = "hardcoded_hex_data";
filesData = ["hardcoded_file_1.bin", "hardcoded_file_2.bin"];
flashFreqData = "40m"; 
flashModeData = "qio";

  } catch (e) {
    
    hexData = hexCode;
  }

  const config = {
    bin: hexData,
    files: filesData,
    flashFreq: flashFreqData,
    flashMode: flashModeData,
    speed: 115200,
    uploadSpeed: 115200,
    tool: 'avrdude',
    cpu: 'atmega328p',
    stdout: process.stdout,
    verbose: true,
    
  };

  

  try {
    const res = await  new upload(config);
    return "Upload successful";
  } catch (error) {
    throw new Error("Upload failed: " + error.message);
  }
};

const compileCode = async (code: string, type: string): Promise<string> => {
  const headers = new Headers();
  headers.append("Content-Type", "text/plain");

  const response = await fetch(
    `${config.server_arduino_url}/upload-code/${type}`,
    {
      method: "POST",
      body: code,
      headers,
    }
  );

  return await response.text();
};