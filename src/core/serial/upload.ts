import type { MicroControllerType } from "../microcontroller/microcontroller";
import config from "../../env";

declare class UploadMultiTool {
  constructor(config: any);

  flash(hex: string, callback: (error: Error | null, result?: string) => void): void;
}

export default UploadMultiTool;

export const upload = async (
  code: string,
  uploader: UploadMultiTool,
  type: MicroControllerType
): Promise<string> => {
  const hexCode = await compileCode(code, type);

  return new Promise((resolve, reject) => {
    uploader.flash(hexCode, (error, result) => {
      if (error) {
        reject(new Error(`Upload failed: ${error.message}`));
      } else {
        resolve(result || "Flash successful");
      }
    });
  });
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
