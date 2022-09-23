import type { ARDUINO_PINS } from "../../microcontroller/selectBoard";

export enum BlockType {
  SETUP = "SETUP",
  SENSOR_SETUP = "SENSOR_SETUP",
  SENSOR_READ = "SENSOR_READ",
  STATE = "STATE",
  VALUE = "VALUE",
  ARDUINO = "ARDUINO",
  FUNCTION = "FUNCTION",
  LIST_CREATE = "LIST_CREATE",
}

export enum PinCategory {
  NONE = "NONE",
  BLUETOOTH = "BLUETOOH",
  BUTTON = "BUTTON",
  IR_REMOTE = "IR_REMOTE",
  LCD_SCREEN = "LCD_SCREEN",
  NEO_PIXEL = "NEO_PIXEL",
  FAST_LED = "FAST_LED",
  LED_MATRIX = "LED_MATRIX",
  LED_COLOR = "LED_COLOR",
  ULTRA_SONIC = "ULTRA_SONIC",
  LED = "LED",
  DIGITAL_WRITE = "DIGITAL_WRITE",
  ANALOG_WRITE = "ANALOG_WRITE",
  DIGITAL_READ_SETUP = "DIGITAL_READ_SETUP",
  ANALOG_READ_SETUP = "ANALOG_READ_SETUP",
  RFID = "RFID",
  SERVO = "SERVO",
  TEMP = "TEMP",
  THERMISTOR = "THERMISTOR",
  PASSIVE_BUZZER = "PASSIVE_BUZZER",
  STEPPER_MOTOR = "STEPPER_MOTOR",
  DIGITAL_DISPLAY = "DIGITAL_DISPLAY",
  JOYSTICK = "JOYSTICK",
}

// These are block type require being put into a setup, loop or function block
export const BlockTypeRequireRootBlock = [
  BlockType.STATE,
  BlockType.VALUE,
  BlockType.SENSOR_READ,
];

export enum BlocklyInputTypes {
  INPUT_STATEMENT = 3,
  INPUT_BLOCK = 1,
}

export const standAloneBlocks = [
  "rfid_setup",
  "arduino_loop",
  "arduino_setup",
  "create_list_number_block",
  "create_list_string_block",
  "create_list_boolean_block",
  "create_list_colour_block",
  "procedures_defnoreturn",
  "lcd_setup",
  "neo_pixel_setup",
  "fastled_setup",
  "soil_sensor_setup",
  "ir_remote_setup",
  "temp_setup",
  "bluetooth_setup",
  "rgb_led_setup",
  "button_setup",
  "message_setup",
  "time_setup",
  "analog_read_setup",
  "led_matrix_setup",
  "digital_read_setup",
  "ultra_sonic_sensor_setup",
  "thermistor_setup",
  "stepper_motor_setup",
  "digital_display_setup",
  "sensorSetupBlocks",
];

export const multipleTopBlocks = [
  "button_setup",
  "digital_read_setup",
  "analog_read_setup",
  "procedures_defnoreturn",
];

export const sensorSetupBlocks = [
  "rfid_setup",
  "button_setup",
  "bluetooth_setup",
  "message_setup",
  "digital_read_setup",
  "analog_read_setup",
  "ir_remote_setup",
  "ultra_sonic_sensor_setup",
  "temp_setup",
  "soil_sensor_setup",
  "thermistor_read",
  "joystick_setup",
];

/**
 * List of key value block type => setup block required
 */
export const blocksThatRequireSetup = {
  bluetooth_send_message: "bluetooth_setup",
  bluetooth_has_message: "bluetooth_setup",
  bluetooth_get_message: "bluetooth_setup",
  lcd_screen_simple_print: "lcd_setup",
  led_matrix_make_draw: "led_matrix_setup",
  led_matrix_turn_one_on_off: "led_matrix_setup",
  lcd_screen_clear: "lcd_setup",
  lcd_screen_print: "lcd_setup",
  lcd_screen_blink: "lcd_setup",
  neo_pixel_set_color: "neo_pixel_setup",
  fastled_set_color: "fastled_setup",
  fastled_set_all_colors: "fastled_setup",
  fastled_show_all_colors: "fastled_setup",
  soil_humidity_percentage: "soil_sensor_setup",
  soil_humidity_value: "soil_sensor_setup",
  soil_is_raining: "soil_sensor_setup",
  ir_remote_has_code_receive: "ir_remote_setup",
  ir_remote_get_code: "ir_remote_setup",
  temp_get_temp: "temp_setup",
  temp_get_humidity: "temp_setup",
  set_color_led: "rgb_led_setup",
  rfid_scan: "rfid_setup",
  rfid_tag: "rfid_setup",
  rfid_card: "rfid_setup",
  is_button_pressed: "button_setup",
  arduino_send_message: "message_setup",
  arduino_get_message: "message_setup",
  arduino_receive_message: "message_setup",
  digital_read: "digital_read_setup",
  analog_read: "analog_read_setup",
  ultra_sonic_sensor_motion: "ultra_sonic_sensor_setup",
  time_seconds: "time_setup",
  thermistor_read: "thermistor_setup",
  stepper_motor_move: "stepper_motor_setup",
  digital_display_set: "digital_display_setup",
  joystick_button: "joystick_setup",
  joystick_angle: "joystick_setup",
  joystick_engaged: "joystick_setup",
};

/**
 * Setup Blocks to human names
 */
export const setupBlockTypeToHumanName = {
  bluetooth_setup: "bluetooth setup block",
  lcd_setup: "LCD setup block",
  neo_pixel_setup: "LED light strip setup block",
  fastled_setup: "LED light strip setup block",
  soil_sensor_setup: "soil sensor setup block",
  ir_remote_setup: "IR remote setup block",
  temp_setup: "temperature sensor setup block",
  rgb_led_setup: "LED color setup block",
  rfid_setup: "RFID setup block",
  button_setup: "button setup block",
  message_setup: "message setup block",
  digital_read_setup: "digital read setup block",
  analog_read_setup: "analog read setup block",
  ultra_sonic_sensor_setup: "ultra sonic sensor setup block",
  led_matrix_setup: "led matrix setup block",
  time_setup: "time setup block",
  thermistor_setup: "thermistor setup block",
  stepper_motor_setup: "stepper motor setup block",
  digital_display_setup: "digital display setup block",
  joystick_setup: "joystick setup block",
};

export const blocksToBlockTypes: {
  [type: string]: { type: BlockType; pinCategory: PinCategory };
} = {
  arduino_loop: { type: BlockType.ARDUINO, pinCategory: PinCategory.NONE },
  arduino_setup: { type: BlockType.ARDUINO, pinCategory: PinCategory.NONE },
  create_list_number_block: {
    type: BlockType.LIST_CREATE,
    pinCategory: PinCategory.NONE,
  },
  create_list_boolean_block: {
    type: BlockType.LIST_CREATE,
    pinCategory: PinCategory.NONE,
  },
  create_list_string_block: {
    type: BlockType.LIST_CREATE,
    pinCategory: PinCategory.NONE,
  },
  create_list_colour_block: {
    type: BlockType.LIST_CREATE,
    pinCategory: PinCategory.NONE,
  },
  led_matrix_setup: {
    type: BlockType.SETUP,
    pinCategory: PinCategory.LED_MATRIX,
  },
  led_matrix_make_draw: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  led_matrix_turn_one_on_off: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  get_number_from_list: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  get_string_from_list: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  get_boolean_from_list: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  get_colour_from_list: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },

  set_number_list_block: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  set_boolean_list_block: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  set_colour_list_block: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  set_string_list_block: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },

  variables_get_number: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  variables_get_string: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  variables_get_boolean: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  variables_get_colour: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  variables_set_boolean: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  variables_set_string: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  variables_set_number: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  variables_set_colour: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },

  colour_random: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  colour_rgb: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  color_picker_custom: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },

  math_number: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  math_arithmetic: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  string_to_number: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  math_round: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  math_modulo: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  math_random_int: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  math_number_property: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },

  text_join: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  text: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  text_length: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  parse_string_block: {
    type: BlockType.VALUE,
    pinCategory: PinCategory.NONE,
  },
  number_to_string: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  text_isEmpty: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  text_changeCase: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },

  procedures_defnoreturn: {
    type: BlockType.FUNCTION,
    pinCategory: PinCategory.NONE,
  },
  procedures_callnoreturn: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  passive_buzzer_note: {
    type: BlockType.STATE,
    pinCategory: PinCategory.PASSIVE_BUZZER,
  },
  passive_buzzer_tone: {
    type: BlockType.STATE,
    pinCategory: PinCategory.PASSIVE_BUZZER,
  },
  controls_ifelse: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  control_if: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  logic_compare: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  logic_negate: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  logic_operation: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },
  logic_boolean: { type: BlockType.VALUE, pinCategory: PinCategory.NONE },

  controls_for: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  controls_repeat_ext: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },

  debug_block: { type: BlockType.STATE, pinCategory: PinCategory.NONE },

  message_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.NONE,
  },
  arduino_get_message: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
  arduino_receive_message: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
  arduino_send_message: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },

  time_setup: { type: BlockType.SENSOR_SETUP, pinCategory: PinCategory.NONE },
  time_seconds: { type: BlockType.SENSOR_READ, pinCategory: PinCategory.NONE },

  delay_block: { type: BlockType.STATE, pinCategory: PinCategory.NONE },

  bluetooth_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.BLUETOOTH,
  },
  bluetooth_send_message: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  bluetooth_has_message: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
  bluetooth_get_message: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },

  lcd_setup: { type: BlockType.SETUP, pinCategory: PinCategory.LCD_SCREEN },
  lcd_screen_print: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  lcd_screen_clear: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  lcd_scroll: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  lcd_screen_simple_print: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  lcd_blink: { type: BlockType.STATE, pinCategory: PinCategory.NONE },
  lcd_backlight: { type: BlockType.STATE, pinCategory: PinCategory.NONE },

  led: { type: BlockType.STATE, pinCategory: PinCategory.LED },
  led_fade: { type: BlockType.STATE, pinCategory: PinCategory.LED },

  neo_pixel_setup: {
    type: BlockType.SETUP,
    pinCategory: PinCategory.NEO_PIXEL,
  },

  neo_pixel_set_color: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  fastled_setup: {
    type: BlockType.SETUP,
    pinCategory: PinCategory.FAST_LED,
  },
  fastled_set_color: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  fastled_set_all_colors: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  fastled_show_all_colors: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  rotate_servo: { type: BlockType.STATE, pinCategory: PinCategory.SERVO },
  // NO WAY TO CHECK BECAUSE OF shield
  move_motor: { type: BlockType.STATE, pinCategory: PinCategory.NONE },

  set_color_led: { type: BlockType.STATE, pinCategory: PinCategory.LED_COLOR },
  rgb_led_setup: {
    type: BlockType.SETUP,
    pinCategory: PinCategory.LED_COLOR,
  },

  digital_write: {
    type: BlockType.STATE,
    pinCategory: PinCategory.DIGITAL_WRITE,
  },
  analog_write: {
    type: BlockType.STATE,
    pinCategory: PinCategory.ANALOG_WRITE,
  },

  analog_read_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.ANALOG_READ_SETUP,
  },
  analog_read: { type: BlockType.SENSOR_READ, pinCategory: PinCategory.NONE },

  button_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.BUTTON,
  },
  is_button_pressed: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },

  digital_read_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.DIGITAL_READ_SETUP,
  },
  digital_read: { type: BlockType.ARDUINO, pinCategory: PinCategory.NONE },

  ir_remote_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.IR_REMOTE,
  },
  ir_remote_has_code_receive: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
  ir_remote_get_code: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },

  ultra_sonic_sensor_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.ULTRA_SONIC,
  },
  ultra_sonic_sensor_motion: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },

  rfid_setup: { type: BlockType.SENSOR_SETUP, pinCategory: PinCategory.RFID },
  rfid_card: { type: BlockType.SENSOR_READ, pinCategory: PinCategory.NONE },
  rfid_tag: { type: BlockType.SENSOR_READ, pinCategory: PinCategory.NONE },
  rfid_scan: { type: BlockType.SENSOR_READ, pinCategory: PinCategory.NONE },

  temp_setup: { type: BlockType.SENSOR_SETUP, pinCategory: PinCategory.TEMP },
  temp_get_temp: { type: BlockType.SENSOR_READ, pinCategory: PinCategory.NONE },
  temp_get_humidity: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },

  thermistor_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.THERMISTOR,
  },

  thermistor_read: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },

  stepper_motor_setup: {
    type: BlockType.SETUP,
    pinCategory: PinCategory.STEPPER_MOTOR,
  },
  stepper_motor_move: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },
  digital_display_setup: {
    type: BlockType.SETUP,
    pinCategory: PinCategory.DIGITAL_DISPLAY,
  },
  digital_display_set: {
    type: BlockType.STATE,
    pinCategory: PinCategory.NONE,
  },

  joystick_setup: {
    type: BlockType.SENSOR_SETUP,
    pinCategory: PinCategory.JOYSTICK,
  },
  joystick_angle: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
  joystick_engaged: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
  joystick_button: {
    type: BlockType.SENSOR_READ,
    pinCategory: PinCategory.NONE,
  },
};

export interface BlockData {
  id: string;
  blockName: string;
  inputBlocks: Input[]; // Blocks connected to the the block that produce values
  inputStatements: InputStatement[]; // Theses are things like inside an if block or arduino loop
  fieldValues: FieldValue[]; // dropdown checkbox text input etc
  nextBlockId: string | undefined; // the block below
  type: BlockType | undefined;
  rootBlockId: string | undefined;
  pins: ARDUINO_PINS[];
  pinCategory: PinCategory;
  metaData: string;
  disabled: boolean;
}

export interface FieldValue {
  name: string;
  value: any;
  validOptions?: Array<{ name: string; value: string }>;
}

export interface InputStatement {
  blockId: string | undefined;
  name: string;
}

export interface Input {
  blockId: string | undefined;
  name: string;
}
