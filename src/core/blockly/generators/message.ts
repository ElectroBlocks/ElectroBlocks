import Blockly from 'blockly';
import selectedBoard from '../../../constants/arduino';

export function stepSerialBegin() {
  Blockly['Arduino'].setupCode_['serial_begin'] =
    '\tSerial.begin(' + selectedBoard().serial_baud_rate + '); \n';
}

Blockly['Arduino']['message_setup'] = function() {
  stepSerialBegin();
  Blockly['Arduino'].functionNames_[
    'getSerialMessage'
  ] = `String getSerialMessage() {
   if (serialMessageDEV.length() > 0) {
     return serialMessageDEV;
   }

   serialMessageDEV = Serial.readStringUntil('|');

   return serialMessageDEV;
};
  `;
  return '';
};

Blockly['Arduino']['arduino_get_message'] = function(block) {
  return ['getSerialMessage()', Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['arduino_receive_message'] = function(block) {
  return ['(getSerialMessage().length() > 0)', Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['arduino_send_message'] = function(block) {
  const message = Blockly['Arduino'].valueToCode(
    block,
    'MESSAGE',
    Blockly['Arduino'].ORDER_ATOMIC
  );

  return '\tSerial.println(' + message + ');\n';
};
