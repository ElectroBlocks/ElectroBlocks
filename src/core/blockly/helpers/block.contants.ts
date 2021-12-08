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
  "digital_read_setup",
  "ultra_sonic_sensor_setup",
];

export const blockMultipleSetup = [
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
];

export interface DisableBlock {
  blockId: string;
  warningText: string | null;
}
