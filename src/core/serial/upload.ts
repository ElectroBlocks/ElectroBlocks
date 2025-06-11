import { ProgramConfig, upload, WebSerialPortPromise } from "@duinoapp/upload-multitool";
import { MicroControllerType } from "../microcontroller/microcontroller";
import { libraries } from "./library";
const extractLibraries = (code: string): string[] => {
  // Simple regex to find #include <LibName.h>
  const regex = /#include\s*<([^>]+)>/g;
  const found = new Set<string>();
  let match;
  while ((match = regex.exec(code)) !== null) {
    // Remove .h extension if present
    const libName = match[1].replace(/\.h$/, "");
    found.add(libName);
  }
  return Array.from(found);
};

const compileCode = async (code: string, type: string): Promise<string> => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
  });
  const requiredLibs = extractLibraries(code)
  .map(lib => libraries.find(l => l.name.replace(/\s+/g, "") === lib.replace(/\s+/g, "")))
  .filter(Boolean);
console.log("Required Libraries:", requiredLibs);
  try {
    ///
    var jsonString = {
      fqbn: "arduino:avr:uno",
      files: [
        {
          content:code,
          name: "arduino/arduino.ino",
        },
      ],
      flags: { verbose: false, preferLocal: false },
      libs: requiredLibs,
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
    tool:  "avrdude",
    cpu: "atmega328p",
    stdout: {
      write: (msg: string) => console.log(msg), // Properly implement the write method
    },
    verbose: true,
  } as any as ProgramConfig;
  await upload(serialport.port, config);

  return "Upload successful";
};

