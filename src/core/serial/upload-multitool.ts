declare module "@duinoapp/upload-multitool" {
    export default class UploadMultiTool {
      constructor(config: any);
      flash(hex: string, callback: (error: Error | null, result?: string) => void): void;
    }
  }
  