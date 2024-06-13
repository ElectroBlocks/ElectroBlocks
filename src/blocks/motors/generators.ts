import Blockly from 'blockly';
import type { Block } from 'blockly';

Blockly['Arduino']['move_motor'] = function(block: Block) {
  const motorNumber = block.getFieldValue('MOTOR');


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

  Blockly['Arduino'].libraries_['include_motor_library'] =
    '#include <AFMotor.h>;\n';
  Blockly['Arduino'].libraries_['include_motor_init_' + motorNumber] =
    'AF_DCMotor motor_' + motorNumber + '(' + motorNumber + ');\n';

  let code = 'motor_' + motorNumber + '.run("' + rotation + '");\n';
  code += 'motor_' + motorNumber + '.setSpeed(' + speed + ');\n';

  return code;
};
