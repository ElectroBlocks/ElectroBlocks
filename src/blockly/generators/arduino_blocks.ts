import Blockly from 'blockly';
import { Block } from 'blockly';
import _ from 'lodash';

Blockly['Arduino']['arduino_setup'] = function(block: Block) {
  const statementsSetup = Blockly['Arduino'].statementToCode(block, 'setup');
  let preSetupCode = '';

  for (const key in Blockly['Arduino'].setupCode_) {
    preSetupCode += Blockly['Arduino'].setupCode_[key] || '';
  }
  return (
    '\nvoid setup() { \n' +
    preSetupCode +
    statementsSetup +
    '}\n'
  );
};

Blockly['Arduino']['arduino_loop'] = function(block: Block) {
  const statementsLoop = Blockly['Arduino'].statementToCode(block, 'loop');

  let resetBluetoothVariable = '';
  let resetMessageVariable = '';
  let resetIrRemoteCode = '';
  let getNewTempReading = '';

  if (!_.isEmpty(Blockly['Arduino'].setupCode_['bluetooth_setup'])) {
    resetBluetoothVariable = '\tbluetoothMessageDEV = ""; \n';
  }

  if (!_.isEmpty(Blockly['Arduino'].setupCode_['serial_begin'])) {
    resetMessageVariable = '\tserialMessageDEV= ""; \n';
  }

  if (!_.isEmpty(Blockly['Arduino'].setupCode_['setup_ir_remote'])) {
    resetIrRemoteCode = '\tirReceiver.resume(); \n';
  }

  if (!_.isEmpty(Blockly['Arduino'].functionNames_['takeTempReading'])) {
    getNewTempReading = '\ttakeTempReading(); \n';
  }
  return (
    '\nvoid loop() { \n' +
    statementsLoop +
    '\n' +
    resetBluetoothVariable +
    resetMessageVariable +
    resetIrRemoteCode +
    getNewTempReading +
    '}'
  );
};
