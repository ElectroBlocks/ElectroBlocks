import { WebSerialPortPromise } from "@duinoapp/upload-multitool";
import { ArduinoFrame, ArduinoFrameContainer } from "../frames/arduino.frame";
import arduinoPortStore from "../../stores/arduino-port.store";

const waitForCommand = async (command: string) => {
  arduinoPortStore.clearMessages();
  var count = 0;
  while (arduinoPortStore.getLastMessage() != command) {
    console.log("waiting for message");
    await new Promise((resolve) => setTimeout(resolve, 10));
    count++;
    if (count > 100) {
      console.info("Timeout waiting for command:", command);
      return;
    }
  }
  return;
};

export const paintUsb = async (frameContainer: ArduinoFrameContainer) => {
  if (arduinoPortStore.isConnected() === false) {
    console.info("Port is not connected");
    return;
  }
  const lastFrame =
    frameContainer.frames[frameContainer.frames.length - 1]?.components;
  if (lastFrame === undefined) {
    console.info("No components found");
    return;
  }
  arduinoPortStore.sendMessage("restart:|");
  await waitForCommand("System:READY");
  const setupMessage = frameContainer.frames[
    frameContainer.frames.length - 1
  ].components.reduce((acc, component) => {
    if (component?.setupCommand === undefined) {
      return acc;
    }
    return acc + component?.setupCommand + "|";
  }, "");

  if (setupMessage === "") {
    return;
  }
  console.log("setupMessage", setupMessage);
  arduinoPortStore.sendMessage(setupMessage);

  await waitForCommand("DONE_NEXT_COMMAND");
};

export const updateUsb = async (frame: ArduinoFrame) => {
  if (arduinoPortStore.isConnected() === false) {
    console.info("Port is not connected");
    return;
  }
  if (frame?.components === undefined) {
    console.info("No components found");
    return;
  }
  const setupMessage = frame.components.reduce((acc, component) => {
    if (
      component?.usbCommands === undefined ||
      component?.usbCommands.length === 0
    ) {
      return acc;
    }

    return acc + component?.usbCommands.join("|");
  }, "");
  if (setupMessage === "") {
    return;
  }
  arduinoPortStore.sendMessage(setupMessage);

  await waitForCommand("DONE_NEXT_COMMAND");
};