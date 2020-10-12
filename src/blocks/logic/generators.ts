import Blockly from 'blockly';
import type { Block } from 'blockly';

Blockly['Arduino']['logic_boolean'] = function(block: Block) {
  // Boolean values true and false.
  const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
  return [code, Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['logic_compare'] = function(block: Block) {
  // Comparison operator.
  const OPERATORS = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const order =
    operator === '==' || operator === '!='
      ? Blockly['Arduino'].ORDER_EQUALITY
      : Blockly['Arduino'].ORDER_RELATIONAL;
  const argument0 = Blockly['Arduino'].valueToCode(block, 'A', order) || '0';
  const argument1 = Blockly['Arduino'].valueToCode(block, 'B', order) || '0';
  const code = '( ' + argument0 + ' ' + operator + ' ' + argument1 + ')';
  return [code, order];
};

Blockly['Arduino']['logic_operation'] = function(block: Block) {
  // Operations 'and', 'or'.
  const operator = block.getFieldValue('OP') === 'AND' ? '&&' : '||';
  const order =
    operator === '&&'
      ? Blockly['Arduino'].ORDER_LOGICAL_AND
      : Blockly['Arduino'].ORDER_LOGICAL_OR;
  let argument0 = Blockly['Arduino'].valueToCode(block, 'A', order);
  let argument1 = Blockly['Arduino'].valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = operator === '&&' ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly['Arduino']['control_if'] = function(block: Block) {
  // If/elseif/else condition.
  let n = 0;
  let code = '',
    branchCode,
    conditionCode;
  do {
    conditionCode =
      Blockly['Arduino'].valueToCode(
        block,
        'IF' + n,
        Blockly['Arduino'].ORDER_NONE
      ) || 'false';
    branchCode = Blockly['Arduino'].statementToCode(block, 'DO' + n);
    code +=
      (n > 0 ? ' else ' : '') +
      'if (' +
      conditionCode +
      ') {\n' +
      branchCode +
      '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly['Arduino'].statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly['Arduino']['controls_ifelse'] = Blockly['Arduino']['control_if'];

Blockly['Arduino']['logic_negate'] = function(block: Block) {
  // Negation.
  const order = Blockly['Arduino'].ORDER_UNARY_PREFIX;
  const argument0 =
    Blockly['Arduino'].valueToCode(block, 'BOOL', order) || 'true';
  const code = '!' + argument0;
  return [code, order];
};
