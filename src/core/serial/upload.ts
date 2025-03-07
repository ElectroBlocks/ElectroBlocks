import type { MicroControllerType } from "../microcontroller/microcontroller";
import config from "../../env";
import UploadMultiTool from "@duinoapp/upload-multitool";

import { upload as multiToolUpload } from "@duinoapp/upload-multitool";
import type { ProgramConfig } from "@duinoapp/upload-multitool";

export const upload = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  const hexCode = await compileCode(code, type);
  const config = {
    // for avr boards, the compiled hex
    bin: hexCode,
    // for esp boards, the compiled files and flash settings
    // flashFreq: compiled.flashFreq,
    // flashMode: compiled.flashMode,
    // baud rate to connect to bootloader
    speed: 115200,
    // baud rate to use for upload (ESP)
    uploadSpeed: 115200,
    // the tool to use, avrdude or esptool
    tool: "avr",
    // the CPU of the device
    cpu: "atmega328p",
    // a standard out interface ({ write(msg: string): void })
    // whether or not to log to stdout verbosely
    verbose: true,
    // handle reconnecting to AVR109 devices when connecting to the bootloader
    // the device ID changes for the bootloader, meaning in some OS's a new connection is required
    // avr109Reconnect?: (opts: ReconnectParams) => Promise<SerialPort>;
  } as ProgramConfig;
  await multiToolUpload(serialport, config);
  // return new Promise((resolve, reject) => {
  //   uploader.flash(hexCode, (error, result) => {
  //     if (error) {
  //       reject(new Error(`Upload failed: ${error.message}`));
  //     } else {
  //       resolve(result || "Flash successful");
  //     }
  //   });
  // });
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
