import {
  componentBlocksThatDoNotRequireSetup,
  type BlockData,
} from "../../blockly/dto/block.type";
import type {
  Timeline,
  ArduinoFrame,
  ArduinoComponentState,
} from "../arduino.frame";
import _ from "lodash";
import {
  digitalWrite,
  analogWrite,
  writePinDefault,
} from "../../../blocks/writepin/blocktoframe";
import {
  lcdScreenSetup,
  lcdSimplePrint,
  lcdScroll,
  lcdPrint,
  lcdBlink,
  lcdClear,
  lcdBacklight,
} from "../../../blocks/lcd_screen/blocktoframe";
import type { VariableData } from "../../blockly/dto/variable.type";
import {
  createListNumberState,
  createListStringState,
  createListBoolState,
  createListColorState,
  setStringInList,
  setNumberInList,
  setColorInList,
  setBooleanInList,
} from "../../../blocks/list/blocktoframe";
import {
  digit4DisplaySetup,
  digitalDisplaySet,
} from "../../../blocks/digit4display/blocktoframe";
import {
  findBlockById,
  findInputStatementStartBlock,
} from "../../blockly/helpers/block-data.helper";
import {
  bluetoothMessage,
  bluetoothSetup,
} from "../../../blocks/bluetooth/blocktoframe";
import { debugBlock } from "../../../blocks/debug/blocktoframe";
import {
  buttonSetup,
  releaseButton,
} from "../../../blocks/button/blocktoframe";
import { irRemoteSetup } from "../../../blocks/ir_remote/blocktoframe";
import { customBlock } from "../../../blocks/functions/blocktoframe";
import {
  neoPixelSetup,
  setNeoPixelColor,
} from "../../../blocks/neopixels/blocktoframe";
import {
  fastLEDSetup,
  setAllColors,
  setFastLEDColor,
  showAllColors,
} from "../../../blocks/fastled/blocktoframe";
import {
  ledMatrixDraw,
  ledMatrixOnLed,
  ledMatrixSetup,
} from "../../../blocks/led_matrix/blocktoframe";
import {
  ledColorSetup,
  setLedColor,
} from "../../../blocks/rgbled/blocktoframe";
import { led, ledDefault, ledFade } from "../../../blocks/led/blocktoframe";
import { digitalReadSetup } from "../../../blocks/digitalsensor/blocktoframe";
import { analogReadSetup } from "../../../blocks/analogsensor/blocktoframe";
import { ifElse } from "../../../blocks/logic/blocktoframe";
import { delayBlock } from "../../../blocks/time/blocktoframe.delay";
import { timeSetup } from "../../../blocks/time/blocktoframe.time";
import { forLoop, simpleLoop } from "../../../blocks/loops/blocktoframe";
import {
  arduinoSendMessage,
  messageSetup,
} from "../../../blocks/message/blocktoframe";
import { ultraSonicSensor } from "../../../blocks/ultrasonic_sensor/blocktoframe";
import {
  motorSetup,
  moveMotor,
  stopMotor,
} from "../../../blocks/motors/blocktoframe";
import { setVariable } from "../../../blocks/variables/blocktoframe";
import { rfidSetup } from "../../../blocks/rfid/blocktoframe";
import {
  defaultServoComponent,
  servoRotate,
} from "../../../blocks/servo/blocktoframe";
import { tempSetupSensor } from "../../../blocks/temperature/blocktoframe";
import { thermistorSetup } from "../../../blocks/thermistor/blocktoframe";
import {
  defaultPassiveBuzzer,
  passiveBuzzer,
} from "../../../blocks/passivebuzzer/blocktoframe";
import {
  moveStepperMotor,
  stepperMotorSetup,
} from "../../../blocks/steppermotor/blocktoframe";
import { joystickSetup } from "../../../blocks/joystick/blocktoframe";

export interface BlockToDefaultComponnet {
  (block: BlockData): ArduinoComponentState;
}

export interface BlockToFrameTransformer {
  (
    blocks: BlockData[],
    block: BlockData,
    variables: VariableData[],
    timeline: Timeline,
    previousState?: ArduinoFrame,
    defaultComponents?: ArduinoComponentState[]
  ): ArduinoFrame[];
}

const blockToFrameTransformerList: {
  [blockName: string]: BlockToFrameTransformer;
} = {
  rfid_setup: rfidSetup,
  bluetooth_setup: bluetoothSetup,
  message_setup: messageSetup,
  time_setup: timeSetup,
  lcd_setup: lcdScreenSetup,
  neo_pixel_setup: neoPixelSetup,
  fastled_setup: fastLEDSetup,
  rgb_led_setup: ledColorSetup,
  analog_read_setup: analogReadSetup,
  digital_read_setup: digitalReadSetup,
  button_setup: buttonSetup,
  ir_remote_setup: irRemoteSetup,
  ultra_sonic_sensor_setup: ultraSonicSensor,
  temp_setup: tempSetupSensor,
  create_list_number_block: createListNumberState,
  create_list_string_block: createListStringState,
  create_list_boolean_block: createListBoolState,
  create_list_colour_block: createListColorState,
  set_string_list_block: setStringInList,
  set_boolean_list_block: setBooleanInList,
  set_colour_list_block: setColorInList,
  set_number_list_block: setNumberInList,
  variables_set_number: setVariable,
  variables_set_string: setVariable,
  variables_set_boolean: setVariable,
  variables_set_colour: setVariable,
  debug_block: debugBlock,
  control_if: ifElse,
  controls_ifelse: ifElse,

  controls_repeat_ext: simpleLoop,
  controls_for: forLoop,
  procedures_callnoreturn: customBlock,

  delay_block: delayBlock,

  arduino_send_message: arduinoSendMessage,

  bluetooth_send_message: bluetoothMessage,

  lcd_screen_simple_print: lcdSimplePrint,
  lcd_scroll: lcdScroll,
  lcd_screen_print: lcdPrint,
  lcd_blink: lcdBlink,
  lcd_screen_clear: lcdClear,
  lcd_backlight: lcdBacklight,

  led: led,
  digital_write: digitalWrite,
  analog_write: analogWrite,
  led_fade: ledFade,
  set_color_led: setLedColor,
  set_simple_color_led: setLedColor,
  neo_pixel_set_color: setNeoPixelColor,
  fastled_set_color: setFastLEDColor,
  fastled_set_all_colors: setAllColors,
  fastled_show_all_colors: showAllColors,
  led_matrix_make_draw: ledMatrixDraw,
  led_matrix_turn_one_on_off: ledMatrixOnLed,
  led_matrix_setup: ledMatrixSetup,

  rotate_servo: servoRotate,
  move_motor: moveMotor,
  stop_motor: stopMotor,
  motor_setup: motorSetup,

  release_button: releaseButton,

  thermistor_setup: thermistorSetup,

  passive_buzzer_note: passiveBuzzer,
  passive_buzzer_tone: passiveBuzzer,
  passive_buzzer_simple: passiveBuzzer,

  stepper_motor_setup: stepperMotorSetup,
  stepper_motor_move: moveStepperMotor,
  digital_display_setup: digit4DisplaySetup,
  digital_display_set: digitalDisplaySet,

  joystick_setup: joystickSetup,
};

const BlockToDefaultComponnet: {
  [blockName: string]: BlockToDefaultComponnet;
} = {
  led: ledDefault,
  led_fade: ledDefault,
  passive_buzzer_note: defaultPassiveBuzzer,
  passive_buzzer_tone: defaultPassiveBuzzer,
  passive_buzzer_simple: defaultPassiveBuzzer,
  digital_write: writePinDefault,
  analog_write: writePinDefault,
  rotate_servo: defaultServoComponent,
};

export const generateFrame: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState,
  defaultComponents
) => {
  try {
    const frames = blockToFrameTransformerList[block.blockName](
      blocks,
      block,
      variables,
      timeline,
      previousState
    );

    if (defaultComponents && defaultComponents.length > 0) {
      for (const frame of frames) {
        const componentPinExists = frame.components
          .map((x) => x.pins.sort())
          .join(",");
        defaultComponents = defaultComponents.filter(
          (x) => !componentPinExists.includes(x.pins.sort().join(","))
        );
        frame.components = [...frame.components, ...defaultComponents];
      }
    }

    return frames;
  } catch (e) {
    console.log(block.blockName, "block name");
    throw e;
  }
};

export const defaultComponentsWithNoSetupBlocks = (blocks: BlockData[]) => {
  const blocksToDefaultSetup = blocks.filter((b) => {
    return componentBlocksThatDoNotRequireSetup.includes(b.blockName);
  });

  let defaultComponents: ArduinoComponentState[] = [];

  for (let block of blocksToDefaultSetup) {
    let component = BlockToDefaultComponnet[block.blockName](block);
    if (
      !defaultComponents.find(
        (x) => x.pins.sort().join(",") == component.pins.sort().join(",")
      )
    ) {
      defaultComponents.push(component);
    }
  }
  return defaultComponents;
};

export const generateInputFrame = (
  block: BlockData,
  blocks: BlockData[],
  variables: VariableData[],
  timeline: Timeline,
  inputName: string,
  previousState?: ArduinoFrame,
  defaultComponents?: ArduinoComponentState[]
): ArduinoFrame[] => {
  // Fixing memory sharing between objects
  previousState = previousState ? _.cloneDeep(previousState) : undefined;
  const startingBlock = findInputStatementStartBlock(blocks, block, inputName);
  if (!startingBlock) {
    return [];
  }
  const arduinoStates = [];
  let nextBlock = startingBlock;
  do {
    const states = generateFrame(
      blocks,
      nextBlock,
      variables,
      timeline,
      previousState,
      defaultComponents
    );
    arduinoStates.push(...states);
    const newPreviousState = states[states.length - 1];
    previousState = _.cloneDeep(newPreviousState);
    // clear out the usb commands so that they don't repeat
    previousState.components.forEach((c) => {
      c.usbCommands = [];
    });

    nextBlock = findBlockById(blocks, nextBlock.nextBlockId);
  } while (nextBlock !== undefined);

  return arduinoStates;
};
