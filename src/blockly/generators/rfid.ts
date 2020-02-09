import Blockly from 'blockly';

Blockly['Arduino']['rfid_scan'] = function() {
  return ['rfidReader.isAvailable()', Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['rfid_tag'] = function() {
  return [
    'String(rfidReader.getTag().getTag())',
    Blockly['Arduino'].ORDER_ATOMIC
  ];
};

Blockly['Arduino']['rfid_card'] = function() {
  return [
    'String(rfidReader.getTag().getCardNumber())',
    Blockly['Arduino'].ORDER_ATOMIC
  ];
};

Blockly['Arduino']['rfid_setup'] = function() {
  Blockly['Arduino'].libraries_['define_rfid'] = '#include "RFIDRdm630.h"\n';
  Blockly['Arduino'].libraries_['setup_rfid'] =
    'RFIDRdm630 rfidReader = RFIDRdm630(6,7);\n';
  return '';
};
