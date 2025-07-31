import { ArduinoFrame, ArduinoFrameContainer } from "../frames/arduino.frame";
import arduinoPortStore, { usbMessageStore } from "../../stores/arduino.store";
import { getAllBlocks, getBlockByType } from "../blockly/helpers/block.helper";
import { eventToFrameFactory } from "../frames/event-to-frame.factory";
import { get } from "svelte/store";
import settingsStore from "../../stores/settings.store";
import { BlockEvent } from "../blockly/dto/event.type";
import { getAllVariables } from "../blockly/helpers/variable.helper";
import { transformVariable } from "../blockly/transformers/variables.transformer";
import { transformBlock } from "../blockly/transformers/block.transformer";
import { MicroControllerType } from "../microcontroller/microcontroller";

const waitForCommand = async (command: string) => {
  arduinoPortStore.clearMessages();
  var count = 0;
  while (!arduinoPortStore.getLastMessage().includes(command)) {
    console.log("waiting for message");
    await new Promise((resolve) => setTimeout(resolve, 10));
    count++;
    if (count > 100) {
      console.info("Timeout waiting for command:", command);
      return;
    }
  }
  console.log("DONE_WAITING", new Date().getTime());
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
  let setupMessage = frameContainer.frames[
    frameContainer.frames.length - 1
  ].components.reduce((acc, component) => {
    if (component?.setupCommand === undefined) {
      return acc;
    }
    return acc + component?.setupCommand + ";";
  }, "");

  if (setupMessage === "") {
    return;
  }
  console.log("setupMessage", setupMessage);
  arduinoPortStore.sendMessage(setupMessage);

  await waitForCommand("DONE_NEXT_COMMAND");
};

export const calculateRealTimeFrames = async () => {
  const arduinoBlock = getBlockByType("arduino_loop");
  const event = createTestEvent(arduinoBlock.id);
  const setupFrames = eventToFrameFactory(event);
  await paintUsb(setupFrames);
  await arduinoPortStore.sendMessage("sense|");
  await waitForCommand("DONE_NEXT_COMMAND");
  let sensorMessage = arduinoPortStore.getLastSensorMessage();
  sensorMessage = sensorMessage.replace("SENSE_COMPLETE", "");

  return eventToFrameFactory(event);
};

const createTestEvent = (blockId: string): BlockEvent => {
  return {
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: "move",
    blockId,
    microController: MicroControllerType.ARDUINO_UNO,
  };
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
  let usbMessage = frame.components.reduce((acc, component) => {
    if (
      component?.usbCommands === undefined ||
      component?.usbCommands.length === 0
    ) {
      return acc;
    }

    return acc + component?.usbCommands.join(";");
  }, "");
  if (usbMessage === "") {
    return;
  }

  arduinoPortStore.sendMessage(usbMessage);

  await waitForCommand("DONE_NEXT_COMMAND");
};
