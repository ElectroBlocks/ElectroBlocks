import { MicroControllerType } from "../microcontroller/microcontroller";
import config from "../../env";
import upload from '@duinoapp/upload-multitool';
import { SerialPort } from 'serialport';
import WebSerialPort from '@duinoapp/upload-multitool';

async function getAvailablePorts() {
    try {
        if (!WebSerialPort.isSupported()) {
            console.error("Web Serial API is not supported in this environment.");
            return [];
        }

        // Request a serial connection from the user
        const serialport = await WebSerialPort.requestPort({}, { baudRate: 115200 });
        await serialport.open();

        console.log("Serial port opened successfully.");
        return [serialport];
    } catch (error) {
        console.error("Error requesting or opening serial port:", error);
        return [];
    }
}

export const arduinoUploader = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  const selectedPorts = await getAvailablePorts();
  if (selectedPorts.length === 0) {
      throw new Error("No available serial port to upload.");
  }

  const serialport = selectedPorts[0];
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
      const res = await new upload(config);
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