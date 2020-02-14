import { BlockSvg } from 'blockly';
import { ARDUINO_UNO_PINS } from '../../../../constants/arduino';
import _ from 'lodash';
import { getAllBlocks } from '../block.helper';
import { DisableBlock } from '../block.contants';

export const duplicatePinBlocks = (): DisableBlock[] => {
  const dupePins = duplicatePins();
  const blockTypesToDisable = duplicatePinCategories()
    .map((category) => {
      return categoryToBlockTypes[category].types;
    })
    .reduce((prev, next) => {
      return [...prev, ...next];
    }, []);

  const potentialBlocksToDisable = getAllBlocks().filter((block) =>
    blockTypesToDisable.includes(block.type)
  );

  return potentialBlocksToDisable
    .filter((block) => {
      const category = getBlockCategory(block);

      if (category.noPinCheck) {
        return true;
      }
      return dupePins.includes(block.getFieldValue('PIN'));
    })
    .map((block) => {
      const duplicatePins = _.intersection(
        dupePins,
        blockToPin[block.type](block).pins
      ).join(',');

      return {
        blockId: block.id,
        warningText: `This blocks has these duplicate pins: ${duplicatePins}.`
      };
    });
};

const duplicatePinCategories = () => {
  const pinCategories = getPinCategories();

  return _.keys(pinCategories).reduce((prev, next) => {
    if (categoryHasDuplicatePins(pinCategories[next], next)) {
      return [...prev, next];
    }
    return prev;
  }, []);
};

const getBlockCategory = (block: BlockSvg) => {
  const categoryName = _.keys(categoryToBlockTypes).find((category) => {
    return categoryToBlockTypes[category].types.includes(block.type);
  });

  return categoryToBlockTypes[categoryName];
};

const categoryHasDuplicatePins = (
  pins: ARDUINO_UNO_PINS[],
  checkingCategory: string
) => {
  const pinCategories = getPinCategories();
  return _.keys(pinCategories)
    .filter((category) => category !== checkingCategory)
    .reduce((prev, next) => {
      if (prev) {
        return true;
      }

      return !_.isEmpty(_.intersection(pinCategories[next], pins));
    }, false);
};

const duplicatePins = () => {
  const categories = duplicatePinCategories();
  const pinCategories = getPinCategories();
  const duplicatePins = categories.map((category) => {
    return pinCategories[category];
  });

  return _.intersection(...duplicatePins);
};

const getPinCategories = (): { [category: string]: ARDUINO_UNO_PINS[] } => {
  const pinBlocks = _.keys(blockToPin);

  return getAllBlocks()
    .filter((block) => pinBlocks.includes(block.type))
    .filter((block) => block.isEnabled())
    .map((block) => {
      return blockToPin[block.type](block);
    })
    .reduce((prev, curr) => {
      // means the category does not exists
      if (!prev[curr.category]) {
        return { ...prev, [curr.category]: curr.pins };
      }
      prev[curr.category] = _.union(prev[curr.category], curr.pins);

      return prev;
    }, {});
};

interface BlockToPin {
  (block: BlockSvg): { category: string; pins: ARDUINO_UNO_PINS[] };
}

const tempSetupPins = (block: BlockSvg) => {
  return { category: 'temp', pins: [block.getFieldValue('PIN')] };
};

const rotateServoPins = (block: BlockSvg) => {
  return { category: 'servo', pins: [block.getFieldValue('PIN')] };
};

const rfidSetupPins = (block: BlockSvg) => {
  return {
    category: 'rfid',
    pins: [block.getFieldValue('TX'), block.getFieldValue('RX')]
  };
};

const analogReadSetupPins = (block: BlockSvg) => {
  return { category: 'analog_read_pin', pins: [block.getFieldValue('PIN')] };
};

const digitalReadSetupPins = (block: BlockSvg) => {
  return { category: 'digital_read_pin', pins: [block.getFieldValue('PIN')] };
};

const analogWritePins = (block: BlockSvg) => {
  return { category: 'analog_write', pins: [block.getFieldValue('PIN')] };
};

const digitalWritePins = (block: BlockSvg) => {
  return { category: 'digital_write', pins: [block.getFieldValue('PIN')] };
};

const ultraSonicSensorPins = (block: BlockSvg) => {
  return {
    category: 'ultra_sonic_sensor',
    pins: [block.getFieldValue('TRIG'), block.getFieldValue('ECHO')]
  };
};

const ledPins = (block: BlockSvg) => {
  return { category: 'led', pins: [block.getFieldValue('PIN')] };
};

const ledColorSetupPins = (block: BlockSvg) => {
  const pinOptions1 = [
    ARDUINO_UNO_PINS.PIN_3,
    ARDUINO_UNO_PINS.PIN_5,
    ARDUINO_UNO_PINS.PIN_6
  ];
  const pinOptions2 = [
    ARDUINO_UNO_PINS.PIN_9,
    ARDUINO_UNO_PINS.PIN_10,
    ARDUINO_UNO_PINS.PIN_11
  ];

  const pins =
    block.getFieldValue('WIRE') === '6-5-3' ? pinOptions1 : pinOptions2;

  return { category: 'led_color', pins };
};

const ledMatrixPins = (_: BlockSvg) => {
  return {
    category: 'led_matrix',
    pins: [
      ARDUINO_UNO_PINS.PIN_10,
      ARDUINO_UNO_PINS.PIN_11,
      ARDUINO_UNO_PINS.PIN_12
    ]
  };
};

const neoPixelSetupPins = (block: BlockSvg) => {
  return { category: 'led_strip', pins: [block.getFieldValue('PIN')] };
};

const lcdScreenPins = (_: BlockSvg) => {
  return {
    category: 'lcd_screen',
    pins: [ARDUINO_UNO_PINS.PIN_A4, ARDUINO_UNO_PINS.PIN_A5]
  };
};

const irRemotePins = (block: BlockSvg) => {
  return { category: 'ir_remote', pins: [block.getFieldValue('PIN')] };
};

const buttonSetupPins = (block: BlockSvg) => {
  return { category: 'button', pins: [block.getFieldValue('PIN')] };
};

const bluetoohSetupPins = (block: BlockSvg) => {
  return {
    category: 'bluetooth',
    pins: [block.getFieldValue('TX'), block.getFieldValue('RX')]
  };
};

const categoryToBlockTypes: {
  [category: string]: { types: string[]; noPinCheck: boolean };
} = {
  bluetooth: { types: ['bluetooth_setup'], noPinCheck: true },
  button: { types: ['button_setup'], noPinCheck: false },
  ir_remote: { types: ['ir_remote_setup'], noPinCheck: true },
  lcd_screen: { types: ['lcd_setup'], noPinCheck: true },
  led_strip: { types: ['neo_pixel_setup'], noPinCheck: true },
  led_matrix: {
    types: ['led_matrix_make_draw', 'led_matrix_turn_one_on_off'],
    noPinCheck: true
  },
  led_color: { types: ['led_color_setup'], noPinCheck: true },
  led: { types: ['led_fade', 'led'], noPinCheck: false },
  ultra_sonic_sensor: {
    types: ['ultra_sonic_sensor_setup'],
    noPinCheck: true
  },
  digital_write: { types: ['digital_write'], noPinCheck: false },
  analog_write: { types: ['analog_write'], noPinCheck: false },
  analog_read_pin: { types: ['analog_read_setup'], noPinCheck: false },
  digital_read_pin: { types: ['digital_read_setup'], noPinCheck: false },
  rfid: { types: ['rfid_setup'], noPinCheck: true },
  servo: { types: ['rotate_servo'], noPinCheck: true },
  temp: { types: ['temp_setup'], noPinCheck: true }
};

const blockToPin: { [block_type: string]: BlockToPin } = {
  temp_setup: tempSetupPins,
  rotate_servo: rotateServoPins,
  rfid_setup: rfidSetupPins,
  analog_read_setup: analogReadSetupPins,
  digital_read_setup: digitalReadSetupPins,
  analog_write: analogWritePins,
  digital_write: digitalWritePins,
  ultra_sonic_sensor_setup: ultraSonicSensorPins,
  led: ledPins,
  led_fade: ledPins,
  led_color_setup: ledColorSetupPins,
  led_matrix_turn_one_on_off: ledMatrixPins,
  led_matrix_make_draw: ledMatrixPins,
  neo_pixel_setup: neoPixelSetupPins,
  lcd_setup: lcdScreenPins,
  ir_remote_setup: irRemotePins,
  button_setup: buttonSetupPins,
  bluetooth_setup: bluetoohSetupPins
};
