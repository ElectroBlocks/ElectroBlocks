import { MicroControllerType } from "../microcontroller/microcontroller";
import config from "../../env";
import { upload } from '@duinoapp/upload-multitool';
import type { ProgramConfig, SerialPortPromise } from '@duinoapp/upload-multitool';



export const upload1 = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  const hexCode = await compileCode(code, type);
  let hexData, filesData, flashFreqData, flashModeData;

  try {
    const parsedData = JSON.parse(hexCode);
    hexData = parsedData.hex;
    filesData = parsedData.files;
    flashFreqData = parsedData.flashFreq;
    flashModeData = parsedData.flashMode;
  } catch (e) {
    // If not JSON, assume it's just a hex file
    hexData = hexCode;
  }

  const uploadConfig: ProgramConfig = {
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

  const serialport: SerialPortPromise = new SerialPort({ path: '/dev/example', baudRate: 115200 }) as any;


  try {
    const res = await upload(serialport, uploadConfig);
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