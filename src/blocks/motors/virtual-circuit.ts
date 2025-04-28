import type {
    SyncComponent,
    ResetComponent,
} from "../../core/virtual-circuit/svg-sync";
import type {
    PositionComponent,
    AfterComponentCreateHook,
    CreateWire,
} from "../../core/virtual-circuit/svg-create";
import {
    createComponentWire, createFromArduinoToComponent,
} from "../../core/virtual-circuit/wire";

import type {Element, Text} from "@svgdotjs/svg.js";
import {MotorShieldState, MOTOR_DIRECTION} from "./state";

import {Svg} from "@svgdotjs/svg.js";

let motorSpin1TimerId;
let motorSpin2TimerId;

export const motorPosition: PositionComponent<MotorShieldState> = (
    state,
    motorEl
) => {
    motorEl.x(110);
    motorEl.y(-305);
};

export const motorCreate: AfterComponentCreateHook<MotorShieldState> = (
    state,
    motorEl
) => {
    if (state.numberOfMotors === 1) {
        motorEl.findOne("#MOTOR_2").hide();
    } else {
        motorEl.findOne("#MOTOR_2").show();
    }
};
export const createMotorWires: CreateWire<MotorShieldState> = (
    state,
    draw,
    motorEl,
    arduino,
    id,
    board,
    area
) => {
    if (area) {
        const {holes, isDown} = area;
        createComponentWire(
            holes[0],
            isDown,
            motorEl,
            state.en1,
            draw,
            arduino,
            id,
            "EN1_PIN",
            board
        );
        createComponentWire(
            holes[1],
            isDown,
            motorEl,
            state.in1,
            draw,
            arduino,
            id,
            "IN1_PIN",
            board
        );
        createComponentWire(
            holes[2],
            isDown,
            motorEl,
            state.in2,
            draw,
            arduino,
            id,
            "IN2_PIN",
            board
        );
        if (state.numberOfMotors == 1) {
            return;
        }

        createComponentWire(
            holes[3],
            isDown,
            motorEl,
            state.in3,
            draw,
            arduino,
            id,
            "IN3_PIN",
            board
        );
        createComponentWire(
            holes[4],
            isDown,
            motorEl,
            state.in4,
            draw,
            arduino,
            id,
            "IN4_PIN",
            board
        );
        createComponentWire(
            holes[5],
            isDown,
            motorEl,
            state.en2,
            draw,
            arduino,
            id,
            "EN2_PIN",
            board
        );
    } else {
        createFromArduinoToComponent(
            draw,
            arduino as Svg,
            state.en1,
            motorEl,
            "EN1_PIN",
            board
        );

        createFromArduinoToComponent(
            draw,
            arduino as Svg,
            state.in2,
            motorEl,
            "IN2_PIN",
            board
        );

        if (state.numberOfMotors == 1) {
            return;
        }


        createFromArduinoToComponent(
            draw,
            arduino as Svg,
            state.in3,
            motorEl,
            "IN3_PIN",
            board
        );


        createFromArduinoToComponent(
            draw,
            arduino as Svg,
            state.in4,
            motorEl,
            "IN4_PIN",
            board
        );

        createFromArduinoToComponent(
            draw,
            arduino as Svg,
            state.en2,
            motorEl,
            "EN2_PIN",
            board
        );
    }
};

export const motorUpdate: SyncComponent = (
    state: MotorShieldState,
    motorEl
) => {
    setDirectionAndSpeed(motorEl, 1, state.speed1, state.direction1);
    setDirectionAndSpeed(motorEl, 2, state.speed2, state.direction2);
    if (state.numberOfMotors === 1) {
        setMotorSpin(motorEl, 1, state.speed1, state.direction1);
    } else {
        setMotorSpin(motorEl, 1, state.speed1, state.direction1);
        setMotorSpin(motorEl, 2, state.speed2, state.direction2);
    }
};

const setMotorSpin = (
    motorEl: Element,
    motorNumber: number,
    speed: number,
    direction: MOTOR_DIRECTION
) => {
    const setSpeed =
        ((direction == MOTOR_DIRECTION.CLOCKWISE ? 1 : -1) * speed) / 30;
    if (motorNumber == 1) {
        clearInterval(motorSpin1TimerId);
        motorSpin1TimerId = setInterval(() => {
            const motorFan = motorEl.findOne(`#MOTOR_1_FAN`) as Element;
            motorFan.rotate(setSpeed);
        }, 10);
    } else {
        clearInterval(motorSpin2TimerId);
        motorSpin2TimerId = setInterval(() => {
            const motorFan = motorEl.findOne(`#MOTOR_2_FAN`) as Element;
            motorFan.rotate(setSpeed);
        }, 10);
    }
};

function setDirectionAndSpeed(
    motorEl: Element,
    motor: number,
    speed: number,
    direction: MOTOR_DIRECTION
) {
    if (speed === 0) {
        motorEl.findOne(`#MOTOR_${motor}_SPEED`).node.innerHTML = `Motor stopped!`;
        motorEl.findOne(`#MOTOR_${motor}_DIRECTION`).node.innerHTML = "";
        return;
    }
    motorEl.findOne(`#MOTOR_${motor}_SPEED`).node.innerHTML = `Speed: ${speed}`;

    motorEl.findOne(`#MOTOR_${motor}_DIRECTION`).node.innerHTML = `Direction: ${
        direction == MOTOR_DIRECTION.CLOCKWISE ? "Clockwise" : "AntiClockwise"
    }`;
}

export const motorReset: ResetComponent = (componentEl: Element) => {
    // (componentEl.findOne("#direction") as Text).node.innerHTML =
    //   "Direction: " +
    //   MOTOR_DIRECTION.CLOCKWISE.charAt(0).toUpperCase() +
    //   MOTOR_DIRECTION.CLOCKWISE.slice(1).toLowerCase();
    // (componentEl.findOne("#speed") as Text).node.innerHTML = "Speed: 1";
};
