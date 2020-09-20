import _ from "lodash";

import {
  Sensor,
  ButtonSensor,
  IRRemoteSensor,
  PinSensor,
  TimeSensor,
  MotionSensor,
  TempSensor,
  RFIDSensor,
} from "../dto/sensors.type";
import { BlockData, BlockType } from "../dto/block.type";
import { findFieldValue } from "../helpers/block-data.helper";
import {
  Timeline,
  ArduinoComponentState,
  ArduinoComponentType,
} from "../../frames/arduino.frame";
import {
  ButtonState,
  IRRemoteState,
  PinState,
  PIN_TYPE,
  RfidState,
  TemperatureState,
  TimeState,
  UltraSonicSensorState,
  ArduinoReceiveMessageState,
} from "../../frames/arduino-components.state";
import { ARDUINO_PINS } from "../../microcontroller/selectBoard";
import { findSensorState } from "../helpers/sensor_block.helper";
import {
  BluetoothSensor,
  saveBluetoothDataInSetupBlock,
  setupBlockToBluetoothState,
} from "../../../plugins/components/bluetooth/bluetooth.state";

interface RetrieveSensorData {
  (block: BlockData): Sensor;
}

interface BlockToComponentState {
  (block: BlockData, timeline: Timeline): ArduinoComponentState;
}

const buttonData = (block: BlockData): ButtonSensor => {
  return {
    is_pressed: findFieldValue(block, "is_pressed") === "TRUE",
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const buttonState = (block: BlockData, timeline: Timeline): ButtonState => {
  const btState = findSensorState<ButtonSensor>(block, timeline);

  return {
    type: ArduinoComponentType.BUTTON,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    isPressed: btState.is_pressed,
  };
};

const irRemoteData = (block: BlockData): IRRemoteSensor => {
  return {
    scanned_new_code: findFieldValue(block, "scanned_new_code") === "TRUE",
    code: findFieldValue(block, "code"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const irRemoteState = (block: BlockData, timeline: Timeline): IRRemoteState => {
  const irRemoteData = findSensorState<IRRemoteSensor>(block, timeline);

  return {
    type: ArduinoComponentType.IR_REMOTE,
    analogPin: findFieldValue(block, "PIN") as ARDUINO_PINS,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    code: irRemoteData.code,
    hasCode: irRemoteData.scanned_new_code,
  };
};

const digitalReadSetup = (block: BlockData): PinSensor => {
  return {
    state: findFieldValue(block, "state") === "TRUE" ? 1 : 0,
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const pinReadState = (pinType: PIN_TYPE) => {
  return (block: BlockData, timeline: Timeline) => {
    const pinSensor = findSensorState<PinSensor>(block, timeline);

    const pictureType = findFieldValue(block, "TYPE");

    return {
      type: ArduinoComponentType.PIN,
      pin: findFieldValue(block, "PIN") as ARDUINO_PINS,
      pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
      state: pinSensor.state,
      pinType: pinType,
      pinPicture: pictureType,
    };
  };
};

const analogReadSetup = (block: BlockData): PinSensor => {
  return {
    state: +findFieldValue(block, "state"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const rfidSetup = (block: BlockData): RFIDSensor => {
  return {
    scanned_card: findFieldValue(block, "scanned_card") === "TRUE",
    card_number: findFieldValue(block, "card_number"),
    tag: findFieldValue(block, "tag"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const rfidState = (block: BlockData, timeline): RfidState => {
  const rfidSensor = findSensorState<RFIDSensor>(block, timeline);

  return {
    type: ArduinoComponentType.RFID,
    txPin: findFieldValue(block, "PIN_TX") as ARDUINO_PINS,
    pins: [findFieldValue(block, "PIN_TX") as ARDUINO_PINS],
    scannedCard: rfidSensor.scanned_card,
    cardNumber: rfidSensor.card_number,
    tag: rfidSensor.tag,
  };
};

const tempSetup = (block: BlockData): TempSensor => {
  return {
    temp: +findFieldValue(block, "temp"),
    humidity: +findFieldValue(block, "humidity"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const tempState = (block: BlockData, timeline: Timeline): TemperatureState => {
  const tempSensor = findSensorState<TempSensor>(block, timeline);

  return {
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    temperature: tempSensor.temp,
    humidity: tempSensor.humidity,
  };
};

const timeSetup = (block: BlockData): TimeSensor => {
  return {
    time_in_seconds: +findFieldValue(block, "time_in_seconds"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const timeState = (block: BlockData, timeline: Timeline): TimeState => {
  return {
    type: ArduinoComponentType.TIME,
    pins: [],
    timeInSeconds:
      +timeline.iteration * +findFieldValue(block, "time_in_seconds"),
  };
};

const ultraSonicSensor = (block: BlockData): MotionSensor => {
  return {
    cm: +findFieldValue(block, "cm"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

const ultraSonicState = (
  block: BlockData,
  timeline: Timeline
): UltraSonicSensorState => {
  const ultraSensor = findSensorState<MotionSensor>(block, timeline);

  return {
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
    trigPin: findFieldValue(block, "PIN_TRIG") as ARDUINO_PINS,
    echoPin: findFieldValue(block, "PIN_ECHO") as ARDUINO_PINS,
    pins: [
      findFieldValue(block, "PIN_TRIG") as ARDUINO_PINS,
      findFieldValue(block, "PIN_ECHO") as ARDUINO_PINS,
    ],
    cm: ultraSensor.cm,
  };
};

const messageState = (
  block: BlockData,
  timeline: Timeline
): ArduinoReceiveMessageState => {
  // TODO FIX WITH MESSAGE
  const btState = findSensorState<BluetoothSensor>(block, timeline);

  return {
    type: ArduinoComponentType.MESSAGE,
    pins: [],
    hasMessage: btState.receiving_message,
    message: btState.message,
  };
};

const blockToSensorData: { [blockName: string]: RetrieveSensorData } = {
  bluetooth_setup: saveBluetoothDataInSetupBlock,
  button_setup: buttonData,
  ir_remote_setup: irRemoteData,
  digital_read_setup: digitalReadSetup,
  analog_read_setup: analogReadSetup,
  rfid_setup: rfidSetup,
  temp_setup: tempSetup,
  time_setup: timeSetup,
  ultra_sonic_sensor_setup: ultraSonicSensor,
  message_setup: saveBluetoothDataInSetupBlock,
};

const blockToSensorComponent: {
  [blockName: string]: BlockToComponentState;
} = {
  bluetooth_setup: setupBlockToBluetoothState,
  button_setup: buttonState,
  ir_remote_setup: irRemoteState,
  digital_read_setup: pinReadState(PIN_TYPE.DIGITAL_INPUT),
  analog_read_setup: pinReadState(PIN_TYPE.ANALOG_INPUT),
  rfid_setup: rfidState,
  temp_setup: tempState,
  time_setup: timeState,
  ultra_sonic_sensor_setup: ultraSonicState,
  message_setup: messageState,
};

export const sensorSetupBlockName = _.keys(blockToSensorComponent);

export const convertToState = (
  block: BlockData,
  timeline: Timeline
): ArduinoComponentState => {
  if (!_.isFunction(blockToSensorComponent[block.blockName])) {
    throw new Error("No Sensor Data function found for " + block.blockName);
  }

  return blockToSensorComponent[block.blockName](block, timeline);
};

export const convertToSensorData = (block: BlockData): Sensor => {
  if (!_.isFunction(blockToSensorData[block.blockName])) {
    throw new Error("No Sensor Data function found for " + block.blockName);
  }

  return blockToSensorData[block.blockName](block);
};
