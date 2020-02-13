import Blockly from 'blockly';
import { Block } from 'blockly';



Blockly['Arduino']['digital_read_setup'] = function(block: Block) {
  const pin = block.getFieldValue('PIN');

  Blockly['Arduino'].setupCode_['digital_read' + pin] =
    '\tpinMode(' + pin + ', INPUT); \n';

  return '';
};

Blockly['Arduino']['analog_read_setup'] = function(block: Block) {
  const pin = block.getFieldValue('PIN');

  Blockly['Arduino'].setupCode_['analog_read' + pin] =
    '\tpinMode(' + pin + ', INPUT); \n';

  return '';
};

Blockly['Arduino']['digital_read'] = function(block: Block) {
  const pin = block.getFieldValue('PIN');

  return ['digitalRead(' + pin + ')', Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['digital_write'] = function(block: Block) {
  const pin = block.getFieldValue('PIN');

  const state = block.getFieldValue('STATE') === 'ON' ? 'HIGH' : 'LOW';

  return 'digitalWrite(' + pin + ', ' + state + '); \n';
};

Blockly['Arduino']['analog_read'] = function(block: Block) {
  const pin = block.getFieldValue('PIN');

  return ['(double)analogRead(' + pin + ')', Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['analog_write'] = function(block: Block) {
  const pin = block.getFieldValue('PIN');
  const numberToSend = Blockly['Arduino'].valueToCode(
    block,
    'WRITE_VALUE',
    Blockly['Arduino'].ORDER_ATOMIC
  );

  return 'analogWrite(' + pin + ', ' + numberToSend + '); \n';
};
