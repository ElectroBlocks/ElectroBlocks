import type { MicroControllerType } from "../microcontroller/microcontroller";
import config from "../../env";
import { browser } from '$app/environment';
let clientLibrary: any;
let ESPLoader, FlashOptions, Transport, LoaderOptions;
  if (browser) {
    (async () => {
      const module = await import("esptool-js");
      clientLibrary = module;
      ({ ESPLoader, FlashOptions, Transport, LoaderOptions } = clientLibrary);
      // Use the library immediately
    })();
  }

  import { serial } from "web-serial-polyfill";


const serialLib = !navigator.serial && navigator.usb ? serial : navigator.serial;

let device = null;
let transport= Transport; 
let chip: string = null;
let esploader= ESPLoader;
const fileArray = [];



declare class AvrgirlArduino {
  constructor(config: any);

  flash(file: string | Uint8Array, call: (error: any) => void): void;
}

export const upload = async (
  code: string,
  avrgirl: AvrgirlArduino,
  type: MicroControllerType
) => {
  console.log("uploading code");

  let fileContent: string;

  if (type === "nodewifi") {
    try {
    console.log("Compiling binary code for nodewifi...");
    fileContent = await compileCode(code, type, "bin");
    console.log("compiled binary code: " + fileContent);
    } catch (error)  {
      console.error("error during compilation:", error);
      throw error;
    }

    const binaryData = new TextEncoder().encode(fileContent);
    console.log("Binary data encoded:", binaryData);

    const uploadButton = document.getElementById("uploadButton");

    // uploadButton.addEventListener("click", async () => {
    //   console.log("Flash process initiated...");

      return flashESP32(binaryData);
      
    //});
  } else {
    fileContent = await compileCode(code, type, "hex");

    const enc = new TextEncoder();
    return new Promise((res, rej) => {
      avrgirl.flash(enc.encode(fileContent) as any, (error) => {
        if (error) {
          rej(error);
        } else {
          res("flash successful");
        }
      });
    });
  }
};

const compileCode = async (
  code: string,
  type: string,
  format: "bin" | "hex"
): Promise<string> => {
  console.log("Compiling code with format:", format);

  const headers = new Headers();
  headers.append("Content-Type", "text/plain");

  const response = await fetch(
    `${config.server_arduino_url}/upload-code/${type}?format=${format}`,
    {
      method: "POST",
      body: code,
      headers,
    }
  );
  const result = await response.text();
  console.log("Code compilation result:", result);
  return result;
};


  const flashESP32 = async (fileContent: Uint8Array) => {
   
    try {
      console.log("Initializing flash process for ESP32...");
     
      if (device === null) {
        console.log("Requesting serial port...");
        device = await serialLib.requestPort();
        console.log("Serial port requested:", device);
        transport = new Transport(device, true);
      }
     //const serialport = new serial({ path: port, baudRate: 115200 });
     //const transport = new Transport(serialport);
     let loaderOptions = {
       transport,
       baudrate: 115200, 
       romBaudrate: 115200,
     };
     esploader = new ESPLoader(loaderOptions);
     console.log("ESPLoader initialized with options:", loaderOptions);
     chip = await esploader.main();
     console.log("Connected to ESP32 chip:", chip);
     
    //  console.log("Connecting to ESP32...");
    //  await transport.connect();
 
    //  console.log("Erasing flash...");
    //  await esploader.eraseFlash();

    let flashOptions = {
      fileArray: [ {
        data: fileContent,
        address:0*10000,
      } ],
      flashSize: "4MB",
      eraseAll: false,
      compress: true
    } ;
    console.log("Flash options prepared:", flashOptions);
    await esploader.writeFlash(flashOptions);
    console.log("ESP32 flashed successfully!");
   } 
   catch (error) {
     console.error("ESP32 flash error:", error);
   }
 }; 