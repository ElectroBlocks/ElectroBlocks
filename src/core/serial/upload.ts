import { ProgramConfig, upload, WebSerialPortPromise } from "@duinoapp/upload-multitool";
import config from "../../env";
import { MicroControllerType } from "../microcontroller/microcontroller";
import { filter } from "lodash";
import { libraries } from "./library";


const compileCode = async (code: string, type: string): Promise<string> => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
  });
  const includedLibraries = code
    .match(/#include\s+<([\w_]+)\.h>/g)
    ?.map((match) => match.match(/<([\w_]+)\.h>/)?.[1]) || [];

  // Match extracted library names with metadata in library.ts
  const libs = libraries.filter((lib) =>
    includedLibraries.includes(lib.name)
  );

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
      libs,
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
    throw error;
  }
};

export const arduinoUploader = async (
  code: string,
  type: MicroControllerType
): Promise<string> => {
  if (!WebSerialPortPromise.isSupported()) {
    throw new Error("Web Serial API is not supported in this environment");
  }
  const serialport = await WebSerialPortPromise.requestPort(
    {},
    { baudRate: 115200 }
  );
  const hexCode = await compileCode(code, type);
  const config = {
    bin: hexCode,
    // files: filesData,
    // flashFreq: flashFreqData,
    // flashMode: flashModeData,
    speed: 115200,
    uploadSpeed: 115200,
    tool: type == MicroControllerType.ESP32 ? "esptool" : "avrdude",
    cpu: "atmega328p",
    stdout: {
      write: (msg: string) => console.log(msg), // Properly implement the write method
    },
    verbose: true,
  } as any as ProgramConfig;
  await upload(serialport.port, config);

  return "Upload successful";
};

