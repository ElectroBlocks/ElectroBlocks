import { WebSerialPortPromise } from "@duinoapp/upload-multitool";
import { ArduinoFrame, ArduinoFrameContainer } from "../frames/arduino.frame";

export const paintUsb = (frameContainer: ArduinoFrameContainer, usb: WebSerialPortPromise) => {
    console.log("paintUsb");
    const setupMessage = frameContainer
        .frames[frameContainer.frames.length - 1]
        .components.reduce((acc, component) => {
            if (component?.setupCommand === undefined) {
                return acc;
            }
            return acc + component?.setupCommand + "|";
        }, '');
    
    if (setupMessage === "") {
        return
    }
    console.log("setupMessage", setupMessage);
    usb.write(setupMessage)
}

export const updateUsb = (frame: ArduinoFrame, usb: WebSerialPortPromise) => {
    console.log(frame
        .components, 'components');
    const setupMessage = frame
        .components.reduce((acc, component) => {
            if (component?.usbCommand === undefined) {
                return acc;
            }
            return acc + component?.usbCommand + "|";       
            }, '')
    if (setupMessage === "") {
        return
    }
    console.log("commandMessage", setupMessage)
    usb.write(setupMessage)
}