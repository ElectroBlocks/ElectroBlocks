import 'jest';
import '../../../../blockly/blocks';

import Blockly, { Workspace, BlockSvg } from 'blockly';
import {
  createArduinoAndWorkSpace,
  createValueBlock,
} from '../../../../../tests/tests.helper';
import { VariableTypes } from '../../../../blockly/dto/variable.type';
import {
  connectToArduinoBlock,
  getAllBlocks,
} from '../../../../blockly/helpers/block.helper';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { BlockEvent } from '../../../../blockly/dto/event.type';
import { eventToFrameFactory } from '../../../event-to-frame.factory';
import { ArduinoFrame, ArduinoComponentType } from '../../../arduino.frame';
import { findComponent } from '../../factory.helpers';
import { MotorState } from '../../../arduino-components.state';

describe('test servos factories', () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  test('test it can do one two motors in different directions.', () => {
    const motor1Block1 = createMotorBlock(1, 'FORWARD', 50);
    const motor2Block2 = createMotorBlock(2, 'BACKWARD', 150);

    const motor1Block3 = createMotorBlock(1, 'BACKWARD', 32);
    const motor2Block4 = createMotorBlock(2, 'FORWARD', 43);

    connectToArduinoBlock(motor1Block1);
    motor1Block1.nextConnection.connect(motor2Block2.previousConnection);
    motor2Block2.nextConnection.connect(motor1Block3.previousConnection);
    motor1Block3.nextConnection.connect(motor2Block4.previousConnection);

    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_MOVE,
      blockId: motor1Block3.id,
    };

    const [state1, state2, state3, state4] = eventToFrameFactory(event);

    expect(state1.explanation).toBe('Motor 1 moves forward at speed 50.');
    expect(state2.explanation).toBe('Motor 2 moves backward at speed 150.');
    expect(state3.explanation).toBe('Motor 1 moves backward at speed 32.');
    expect(state4.explanation).toBe('Motor 2 moves forward at speed 43.');

    const motor1 = findComponent<MotorState>(
      state1,
      ArduinoComponentType.MOTOR,
      undefined,
      1
    );
    expect(motor1.direction).toBe('FORWARD');
    expect(motor1.speed).toBe(50);
    expect(motor1.motorNumber).toBe(1);

    verifyMotorServos(state2, 50, 150, 'FORWARD', 'BACKWARD');
    verifyMotorServos(state3, 32, 150, 'BACKWARD', 'BACKWARD');
    verifyMotorServos(state4, 32, 43, 'BACKWARD', 'FORWARD');
  });

  const createMotorBlock = (
    motorNumber: number,
    direction: string,
    speed: number
  ) => {
    const numberBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      speed
    );
    const numberBlockMotor = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      motorNumber
    );
    const motorBlock = workspace.newBlock('move_motor') as BlockSvg;

    motorBlock.setFieldValue(direction, 'DIRECTION');
    motorBlock
      .getInput('MOTOR')
      .connection.connect(numberBlockMotor.outputConnection);
    motorBlock
      .getInput('SPEED')
      .connection.connect(numberBlock.outputConnection);

    return motorBlock;
  };

  const verifyMotorServos = (
    state: ArduinoFrame,
    motor1Speed: number,
    motor2Speed: number,
    motor1Direction: string,
    motor2Direction: string
  ) => {
    const motor1 = findComponent<MotorState>(
      state,
      ArduinoComponentType.MOTOR,
      undefined,
      1
    );

    const motor2 = findComponent<MotorState>(
      state,
      ArduinoComponentType.MOTOR,
      undefined,
      2
    );

    expect(motor1.direction).toBe(motor1Direction);
    expect(motor2.direction).toBe(motor2Direction);

    expect(motor1.speed).toBe(motor1Speed);
    expect(motor2.speed).toBe(motor2Speed);

    expect(state.components.length).toBe(2);
  };
});
