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

Blockly["Arduino"]["rfid_setup"] = function (block) {
  const txPin = block.getFieldValue("PIN_TX");
  const rxPin = block.getFieldValue("PIN_RX");
  Blockly["Arduino"].libraries_["define_rfid"] =
    '#include "RFIDRdm630.h"  // Includes the RFID library\n';
  Blockly["Arduino"].libraries_[
    "setup_rfid"
  ] = `// Initializes RFID reader object with RX pin and TX pin 
RFIDRdm630 rfidReader = RFIDRdm630(${txPin},${rxPin});\n`;
  return "";
};
