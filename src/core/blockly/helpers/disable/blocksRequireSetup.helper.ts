import { getAllBlocks, getBlockByType } from '../block.helper';
import { DisableBlock, standAloneBlocks } from '../block.contants';

/**
 * List of key value block type => setup block required
 */
const blocksThatRequireSetup = {
  bluetooth_send_message: 'bluetooth_setup',
  bluetooth_has_message: 'bluetooth_setup',
  bluetooth_get_message: 'bluetooth_setup',
  lcd_screen_simple_print: 'lcd_setup',
  lcd_screen_clear: 'lcd_setup',
  lcd_screen_print: 'lcd_setup',
  lcd_screen_blink: 'lcd_setup',
  neo_pixel_set_color: 'neo_pixel_setup',
  soil_humidity_percentage: 'soil_sensor_setup',
  soil_humidity_value: 'soil_sensor_setup',
  soil_is_raining: 'soil_sensor_setup',
  ir_remote_has_code_receive: 'ir_remote_setup',
  ir_remote_get_code: 'ir_remote_setup',
  temp_get_temp: 'temp_setup',
  temp_get_humidity: 'temp_setup',
  set_color_led: 'led_color_setup',
  rfid_scan: 'rfid_setup',
  rfid_tag: 'rfid_setup',
  rfid_card: 'rfid_setup',
  is_button_pressed: 'button_setup',
  arduino_send_message: 'message_setup',
  arduino_get_message: 'message_setup',
  arduino_receive_message: 'message_setup',
  digital_read: 'digital_read_setup',
  analog_read: 'analog_read_setup',
  ultra_sonic_sensor_motion: 'ultra_sonic_sensor_setup'
};

/**
 * Setup Blocks to human names
 */
const setupBlockTypeToHumanName = {
  bluetooth_setup: 'bluetooth setup block',
  lcd_setup: 'LCD setup block',
  neo_pixel_setup: 'LED light strip setup block',
  soil_sensor_setup: 'soil sensor setup block',
  ir_remote_setup: 'IR remote setup block',
  temp_setup: 'temperature sensor setup block',
  led_color_setup: 'LED color setup block',
  rfid_setup: 'RFID setup block',
  button_setup: 'button setup block',
  message_setup: 'message setup block',
  digital_read_setup: 'digital read setup block',
  analog_read_setup: 'analog read setup block',
  ultra_sonic_sensor_setup: 'ultra sonic sensor setup block'
};

export const blocksRequireSetup = (): DisableBlock[] => {
  const blocks = getAllBlocks();

  return blocks
    .filter((block) => !standAloneBlocks.includes(block.type))
    .filter((block) => blocksThatRequireSetup[block.type])
    .filter((block) => getBlockByType(blocksThatRequireSetup[block.type]) === undefined)
    .map((block) => {
      const warningText = `This block requires a ${
        setupBlockTypeToHumanName[blocksThatRequireSetup[block.type]]
      }.`;
      return {
        blockId: block.id,
        warningText
      };
    });
};
