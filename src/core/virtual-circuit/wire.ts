import {Element, Line, Svg} from "@svgdotjs/svg.js";
import _ from "lodash";
import resistorSvg from "../virtual-circuit/commonsvgs/resistors/resistor-small.svg?raw";
import horizontalResistorSvg from "../virtual-circuit/commonsvgs/resistors/resistor-small-horizontal.svg?raw";

import {
    Breadboard,
    BreadBoardArea,
    MicroController,
} from "../microcontroller/microcontroller";
import {ANALOG_PINS, ARDUINO_PINS} from "../microcontroller/selectBoard";
import {
    findSvgElement,
    findComponentConnection,
    findArduinoConnectionCenter,
} from "./svg-helpers";
import {ohmsToBands} from "./resistor-color-calculator";

let breadboard: Breadboard = {
    areas: [],
    order: [],
};

export const takeBoardAreaWithExistingComponent = (holes: number[]) => {
    const areas = breadboard.areas;
    const areaIndex = areas.findIndex(
        (a) => a.holes.sort().join("-") === holes.sort().join("-")
    );
    breadboard.areas[areaIndex].taken = true;
};

export const takeBoardArea = (): BreadBoardArea | null => {
    const areas = breadboard?.areas;
    for (let orderIndex in breadboard?.order ?? []) {
        const areaIndex = breadboard.order[orderIndex];
        const area = areas[areaIndex];
        if (!area.taken) {
            breadboard.areas[areaIndex].taken = true;
            return breadboard.areas[areaIndex];
        }
    }

    return null;
};

export const createFromArduinoToComponent = (
    draw: Svg,
    arduino: Svg,
    pin: ARDUINO_PINS,
    componentEl: Element,
    componentConnectionId: string,
    board: MicroController,
    color: string | null = null
) => {
    console.log(componentEl, componentConnectionId)
    const componentPin = findComponentConnection(
        componentEl,
        componentConnectionId
    );
    const pinConnection = board.pinConnections[pin];
    const arduinoPin = findArduinoConnectionCenter(arduino, pinConnection.id);
    const line = draw
        .line()
        .plot(arduinoPin.x, arduinoPin.y, componentPin.x, componentPin.y)
        .stroke({width: 2, color: color ?? pinConnection.color, linecap: "round"});


    line.data("connection-id", componentConnectionId);
    line.data("component-id", componentEl.id());
    line.data("type", "wire");
    line.data("update-wire", true);
    line.data("hole-id", pinConnection.id);
}
export const createGroundOrPowerWireArduino = (
    draw: Svg,
    arduino: Svg,
    pin: ARDUINO_PINS,
    componentEl: Element,
    board: MicroController,
    type: "ground" | "power",
    pinConnectionId: string = "",
) => {
    if (pinConnectionId === "") {
        pinConnectionId = type === "ground" ? "PIN_GND" : "PIN_POWER";
    }
    const color = type === "ground" ? "#000" : "#AA0000";

    const componentPin = findComponentConnection(
        componentEl,
        pinConnectionId
    );
    const pinConnection = board.pinConnections[pin];
    let arduinoPinConnection = type === "ground" ? pinConnection.gnd : pinConnection.power;
    if (!arduinoPinConnection) {
        arduinoPinConnection = pinConnection.id;
    }
    console.log(arduinoPinConnection)
    const arduinoPin = findArduinoConnectionCenter(arduino, arduinoPinConnection);
    const line = draw
        .line()
        .plot(arduinoPin.x, arduinoPin.y, componentPin.x, componentPin.y)
        .stroke({width: 2, color: color, linecap: "round"});


    line.data("connection-id", pinConnectionId);
    line.data("component-id", componentEl.id());
    line.data("type", "wire");
    line.data("update-wire", true);
    line.data("hole-id", arduinoPinConnection);
}

export const createWireFromArduinoToBreadBoard = (
    pin: ARDUINO_PINS,
    arduinoEl: Svg,
    draw: Svg,
    breadBoardHoleId,
    componentId: string,
    board: MicroController,
    color: string = ""
) => {
    showPin(draw, pin);

    const hole = findBreadboardHoleXY(breadBoardHoleId, arduinoEl, draw);
    const pinConnection = board.pinConnections[pin];
    const arduinoPin = findArduinoConnectionCenter(arduinoEl, pinConnection.id);
    color = color === "" ? pinConnection.color : color;
    const line = draw
        .line()
        .plot(hole.x, hole.y, arduinoPin.x, arduinoPin.y)
        .stroke({width: 2, color, linecap: "round"});

    line.data("component-id", componentId);
    line.data("type", "wire");
    line.data("update-wire", false);
};

export const createWireComponentToBreadboard = (
    holeId: string,
    componentEl: Element,
    draw: Svg,
    arduinoEl: Svg | Element,
    componentConnectionId: string,
    componentId: string,
    color: string,
    updateWireWhenComponentMoves: boolean = true
) => {
    const hole = findBreadboardHoleXY(holeId, arduinoEl, draw);
    const componentPin = findComponentConnection(
        componentEl,
        componentConnectionId
    );
    const line = draw
        .line()
        .plot(hole.x, hole.y, componentPin.x, componentPin.y)
        .stroke({width: 2, color, linecap: "round"});
    line.data("connection-id", componentConnectionId);
    line.data("component-id", componentId);
    line.data("type", "wire");
    line.data("update-wire", updateWireWhenComponentMoves);
    line.data("hole-id", holeId);
};

export const createWireBreadboard = (
    holeIdA: string,
    holeIdB: string,
    color: string,
    draw: Svg,
    arduinoEl: Svg,
    componentId: string
) => {
    const holeA = findBreadboardHoleXY(holeIdA, arduinoEl, draw);
    const holeB = findBreadboardHoleXY(holeIdB, arduinoEl, draw);

    const line = draw
        .line()
        .plot(holeA.x, holeA.y, holeB.x, holeB.y)
        .stroke({width: 2, color, linecap: "round"});

    line.data("component-id", componentId);
    line.data("type", "wire");
    line.data("update-wire", false);
};

export const getGroundorPowerWireLetter = (
    isDown: boolean,
    type: "ground" | "power"
) => {
    if (isDown && type === "power") {
        return "W";
    }

    if (isDown && type === "ground") {
        return "X";
    }

    if (!isDown && type === "power") {
        return "Y";
    }

    return "Z";
};

export const createFromArduinoToArduino = (
    draw: Svg,
    arduino: Svg,
    pinFrom: ARDUINO_PINS,
    pinTo: ARDUINO_PINS,
    board: MicroController,
    color: string | null = null
) => {
    const pinFromConnection = board.pinConnections[pinFrom];
    const pinToConnection = board.pinConnections[pinTo];

    const arduinoPinFrom = findArduinoConnectionCenter(arduino, pinFromConnection.id);
    const arduinoPinTo = findArduinoConnectionCenter(arduino, pinToConnection.id);

    if (arduinoPinFrom && arduinoPinTo) {
        // Calculate control points for the curve
        // The control points are positioned at a distance from the start and end points
        // to create a smooth curve
        const dx = arduinoPinTo.x - arduinoPinFrom.x;
        const dy = arduinoPinTo.y - arduinoPinFrom.y;

        // Create control points perpendicular to the line
        const controlPoint1X = arduinoPinFrom.x + dx / 2 - dy / 2;
        const controlPoint1Y = arduinoPinFrom.y + dy / 2 + dx / 2;
        const controlPoint2X = arduinoPinTo.x - dx / 2 - dy / 2;
        const controlPoint2Y = arduinoPinTo.y - dy / 2 + dx / 2;

        // Create a curved path using SVG.js path method
        const pathString = `M ${arduinoPinFrom.x} ${arduinoPinFrom.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${arduinoPinTo.x} ${arduinoPinTo.y}`;
        const path = draw
            .path(pathString)
            .fill('none')
            .stroke({width: 2, color: color ?? pinFromConnection.color, linecap: "round"});

        path.data("type", "wire");
        path.data("update-wire", false);
        path.data("pin-from", pinFrom);
        path.data("pin-to", pinTo);
    }

}

export const createDirectGroundWire = () => {

}
export const createGroundOrPowerWire = (
    hole: number,
    isDown: boolean,
    componentEl: Element,
    draw: Svg,
    arduino: Element,
    componentId: string,
    type: "ground" | "power",
    pinConnectionId: string = "",
    noComponentWire = false
) => {
    const groundHole = `pin${hole}${isDown ? "E" : "F"}`;
    if (pinConnectionId === "") {
        pinConnectionId = type === "ground" ? "PIN_GND" : "PIN_POWER";
    }
    const color = type === "ground" ? "#000" : "#AA0000";
    const breadBoardHoleA = `pin${hole}${isDown ? "A" : "J"}`;
    // This is so that it does not collide with connector wire in the breadboard.
    const breadBoardHoleB = `pin${
        hole == 31 ? 30 : hole
    }${getGroundorPowerWireLetter(isDown, type)}`;
    if (!noComponentWire) {
        createWireComponentToBreadboard(
            groundHole,
            componentEl,
            draw,
            arduino,
            pinConnectionId,
            componentId,
            color
        );
    }

    createWireBreadboard(
        breadBoardHoleA,
        breadBoardHoleB,
        color,
        draw,
        arduino as Svg,
        componentId
    );
};

export const createComponentWire = (
    hole: number,
    isDown: boolean,
    componentEl: Element,
    pin: ARDUINO_PINS,
    draw: Svg,
    arduino: Element,
    componentId: string,
    connectionId: string,
    board: MicroController
) => {
    const holeId = `pin${hole}${isDown ? "E" : "F"}`;
    const breadboardHoleIdToBoard = `pin${hole}${isDown ? "A" : "J"}`;
    const color = board.pinConnections[pin].color;
    createWireComponentToBreadboard(
        holeId,
        componentEl,
        draw,
        arduino,
        connectionId,
        componentId,
        color
    );

    createWireFromArduinoToBreadBoard(
        pin,
        arduino as Svg,
        draw,
        breadboardHoleIdToBoard,
        componentId,
        board
    );
};

export const findBreadboardHoleXY = (
    pinHoleId,
    arduino: Element,
    draw: Svg
) => {
    const hole = findSvgElement(pinHoleId, draw);
    return {
        x: hole.cx() + arduino.x(),
        y: hole.cy() + arduino.y(),
    };
};

export const findResistorBreadboardHoleXY = (
    holeId: string,
    arduino: Element,
    draw: Svg
) => {
    const hole = findSvgElement(holeId, draw);
    (window as any).hole = hole;
    return {
        x: hole.cx() + arduino.x(),
        y: (hole.findOne("circle") as Element).cy() + arduino.y() - 1,
    };
};

export const createResistor = (
    arduino: Svg | Element,
    draw: Svg,
    hole: number,
    isConnecting: boolean, // This means that it's connecting the top and bottom of the breadboard
    componentId: string,
    direction: "vertical" | "horizontal",
    ohms: number
) => {
    const svgString =
        direction === "vertical" ? resistorSvg : horizontalResistorSvg;
    const resistorEl = draw.svg(svgString).last();

    const [bandColor1, bandColor2, bandColor3] = ohmsToBands(ohms);

    resistorEl.findOne("#BAND_1").node.style.stroke = bandColor1;
    resistorEl.findOne("#BAND_2").node.style.stroke = bandColor2;
    resistorEl.findOne("#BAND_3").node.style.stroke = bandColor3;
    resistorEl.data("component-id", componentId);
    const holeId = `pin${hole}${isConnecting ? "F" : "D"}`;

    const {x, y} = findResistorBreadboardHoleXY(holeId, arduino, draw);
    if (direction === "vertical") {
        resistorEl.cx(x);
        resistorEl.y(y);
    } else {
        resistorEl.x(x - 1);
        resistorEl.y(y - 2);
    }

    if (isConnecting) {
        createWireComponentToBreadboard(
            `pin${hole}E`,
            resistorEl,
            draw,
            arduino,
            "WIRE_1",
            componentId,
            "#999",
            false
        );
    }
};

export const resetBreadBoardHoles = (board: MicroController) => {
    breadboard = _.cloneDeep(board.breadboard);
};

export const showPin = (draw: Svg, pin: ARDUINO_PINS) => {
    if (ANALOG_PINS.includes(pin)) {
        const wire = draw.findOne(`#${pin}`);
        if (wire) {
            wire.show();
        }
    }
};

export const hideAllAnalogWires = (draw: Svg) => {
    ANALOG_PINS.forEach((pin) => {
        const wire = draw.findOne(`#${pin}`);
        if (wire) {
            wire.hide();
        }
    });
};

export const updateWires = (element: Element, draw: Svg, arduino: Svg) => {
    console.log(element.id())
    const wires = draw.find(
        `[data-component-id=${element.id()}]`
    ) as any[] as Line[];
    wires
        .filter((w) => {
            return w.data("type") == "wire" && w.data("update-wire");
        })
        .forEach((w) => {
            const holeId = w.data("hole-id");
            const hole = findSvgElement(holeId, arduino);
            const holeX = hole.cx() + arduino.x();
            const holeY = hole.cy() + arduino.y();
            const connectionId = w.data("connection-id");
            const componentPin = findComponentConnection(element, connectionId);
            w.plot(holeX, holeY, componentPin.x, componentPin.y);
        });
};
