import Blockly from 'blockly';
import { Block } from 'blockly';

Blockly['Arduino']['temp_setup'] = function(block: Block) {
  Blockly['Arduino'].libraries_['temp_setup'] =
    '#include <dht.h>;\n dht DHT;\n';

  Blockly['Arduino'].functionNames_['takeTempReading'] = `
void takeTempReading() {
  DHT.read11(${block.getFieldValue('PIN')});
}`;

  return '';
};

Blockly['Arduino']['temp_get_temp'] = function() {
  return ['DHT.temperature', Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['temp_get_humidity'] = function() {
  return ['DHT.humidity', Blockly['Arduino'].ORDER_ATOMIC];
};
