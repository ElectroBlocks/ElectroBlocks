import Blockly from 'blockly';
import type { Block } from 'blockly';

Blockly['Arduino']['move_motor'] = function(block: Block) {
  const motorNumber = block.getFieldValue('MOTOR');
  const pin1= block.getFieldValue('PIN_1');
  const pin2= block.getFieldValue('PIN_2');


  const direction = block.getFieldValue('DIRECTION').toUpperCase();
  let rotation;
  if (direction === 'CLOCKWISE') {
    rotation = 'FORWARD';
  } else {
    rotation = 'BACKWARD';
  }

  const speed = Blockly['Arduino'].valueToCode(
    block,
    'SPEED',
    Blockly['Arduino'].ORDER_ATOMIC
  );
  // if(motorNumber==1 || motorNumber==2){
  Blockly['Arduino'].libraries_['include_motor_library'] =
    '#include <L298N.h>;\n';
  // }
  // else if(motorNumber==1 && motorNumber==2){
  //   Blockly['Arduino'].libraries_['include_motor_library'] =
  //   '#include <L298NX2.h>;\n';
  // }
 
  Blockly["Arduino"].setupCode_["move_motor"+ motorNumber] =
  "pinMode(motor"+ motorNumber + "pin"+ pin1 + ", OUTPUT);\n"+
  "pinMode(motor"+ motorNumber + "pin"+ pin2 + ", OUTPUT);\n";

  Blockly['Arduino'].libraries_['include_motor_init_' + motorNumber] =
    'AF_DCMotor motor_' + motorNumber + '(' + motorNumber + ');\n';

  let code = 'motor_' + motorNumber + '.run("' + rotation + '");\n';
  code += 'motor_' + motorNumber + '.setSpeed(' + speed + ');\n';

  return code;
};
