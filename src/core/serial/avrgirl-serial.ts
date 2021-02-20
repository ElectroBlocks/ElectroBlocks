export class SerialPort {
  public browser;

  public options;

  public path;

  public isOpen;

  public port;

  public writer;

  public reader;

  public baudRate;

  public requestOptions;

  public messageRaw;

  public chunks = "";

  constructor(options, private onMessage: (message: string) => void) {
    this.options = options || {};

    this.browser = true;
    this.path = this.options.path;
    this.isOpen = false;
    this.port = null;
    this.writer = null;
    this.reader = null;
    this.baudRate = this.options.baudRate;
    this.requestOptions = this.options.requestOptions || {};
    this.messageRaw = "";

    if (this.options.autoOpen) this.open();
  }

  list(callback?) {
    return (navigator as any).serial
      .getPorts()
      .then((list) => {
        if (callback) {
          return callback(null, list);
        }
      })
      .catch((error) => {
        if (callback) {
          return callback(error);
        }
      });
  }

  open(callback?) {
    (window.navigator as any).serial
      .requestPort(this.requestOptions)
      .then((serialPort) => {
        this.port = serialPort;
        if (this.isOpen) return;
        return this.port.open({ baudRate: this.baudRate || 57600, baudrate: this.baudRate || 57600 });
      })
      .then(() => (this.writer = this.port.writable.getWriter()))
      .then(() => (this.reader = this.port.readable.getReader()))
      .then(async () => {
        this.isOpen = true;
        callback(null);
        while (this.port.readable.locked) {
          try {
            const { value, done } = await this.reader.read();
            if (done) {
              break;
            }
            let textDecoder = new TextDecoder();

            // Append new chunks to existing chunks.
            this.chunks += textDecoder.decode(value);
            // For each line breaks in chunks, send the parsed lines out.
            const lines = this.chunks.split("\n");
            this.chunks = lines.pop();
            lines.forEach((line: string) => this.onMessage(line));
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((error) => {
        callback(error);
      });
  }

  async close(callback) {
    try {
      await this.reader.cancel();
      await this.reader.releaseLock();
      await this.writer.releaseLock();
      await this.port.close();
      this.isOpen = false;
      this.chunks = "";
    } catch (error) {
      if (callback) return callback(error);
      throw error;
    }
    callback && callback(null);
  }

  async set(props: any = {}, callback) {
    try {
      const signals: any = {};
      if (Object.prototype.hasOwnProperty.call(props, "dtr")) {
        signals.dataTerminalReady = props.dtr;
      }
      if (Object.prototype.hasOwnProperty.call(props, "rts")) {
        signals.requestToSend = props.rts;
      }
      if (Object.prototype.hasOwnProperty.call(props, "brk")) {
        signals.break = props.brk;
      }
      if (Object.keys(signals).length > 0) {
        await this.port.setSignals(signals);
      }
    } catch (error) {
      if (callback) return callback(error);
      throw error;
    }
    if (callback) return callback(null);
  }

  write(message, callback) {
    let textEncoder = new TextEncoder();
    this.writer.write(textEncoder.encode(message));
    if (callback) return callback(null);
  }

  async read(callback) {
    let buffer;
    try {
      buffer = await this.reader.read();
    } catch (error) {
      if (callback) return callback(error);
      throw error;
    }
    if (callback) callback(null, buffer);
  }

  // TODO: is this correct?
  flush(callback) {
    //this.port.flush(); // is this sync or a promise?
    console.warn("flush method is a NOP right now");
    if (callback) return callback(null);
  }

  // TODO: is this correct?
  drain(callback) {
    // this.port.drain(); // is this sync or a promise?
    console.warn("drain method is a NOP right now");
    if (callback) return callback(null);
  }
}
