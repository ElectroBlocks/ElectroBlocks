import type { BlockEvent } from "../blockly/dto/event.type";
import {
  ArduinoFrame,
  Timeline,
  ArduinoComponentState,
  SENSOR_COMPONENTS,
  ArduinoFrameContainer,
  ArduinoComponentType,
} from "./arduino.frame";
import { BlockType, BlockData } from "../blockly/dto/block.type";
import {
  defaultComponentsWithNoSetupBlocks,
  generateFrame,
} from "./transformer/block-to-frame.transformer";
import _ from "lodash";
import {
  getLoopTimeFromBlockData,
  findArduinoLoopBlock,
  findArduinoSetupBlock,
  findFieldValue,
} from "../blockly/helpers/block-data.helper";
import {
  sensorSetupBlockName,
  convertToState,
  convertArduinoStringToSensorState,
} from "../blockly/transformers/sensor-data.transformer";
import { generateInputFrame } from "./transformer/block-to-frame.transformer";
import { senseDataArduino } from "../../stores/arduino.store";
import { TimeState } from "../../blocks/time/state";
import { getAllBlocks, getBlockByType } from "../blockly/helpers/block.helper";
import { transformBlock } from "../blockly/transformers/block.transformer";
import { getAllVariables } from "../blockly/helpers/variable.helper";
import { transformVariable } from "../blockly/transformers/variables.transformer";

export async function* generateNextFrame(
  event: BlockEvent
): AsyncGenerator<ArduinoFrame> {
  let sensorDataString = await senseDataArduino();
  let frames = generatePreLoopFrames(event, sensorDataString);
  for (let frame of frames) {
    if (frame.timeLine.function == "setup") {
      yield frame;
    }
  }
  let realTimeLoopNumber = 1;
  while (true) {
    sensorDataString = await senseDataArduino();
    frames = generateFramesWithLoop(
      event,
      frames[frames.length - 1],
      1,
      sensorDataString,
      true,
      realTimeLoopNumber
    );
    for (const frame of frames) {
      yield frame;
    }
    realTimeLoopNumber += 1;
  }
}

export const eventToFrameFactory = (
  event: BlockEvent
): ArduinoFrameContainer => {
  const { blocks } = event;
  let setupframes = generatePreLoopFrames(event);
  const loopTimes = getLoopTimeFromBlockData(blocks);
  let framesWithLoop = generateFramesWithLoop(
    event,
    setupframes[setupframes.length - 1],
    loopTimes
  );
  const frames = [...setupframes, ...framesWithLoop];
  // console.log(frames, "frames");
  return {
    board: event.microController,
    frames,
    error: false,
  };
};

export const generateNewFramesWithLoop = (previousFrame: ArduinoFrame) => {
  const blockSvgs = getAllBlocks();
  const blocks = blockSvgs.map((b) => transformBlock(b));
  const arduinoLoopBlock = findArduinoLoopBlock(blocks);
  const blocklyVariables = getAllVariables();
  const electroBlocksVariables = blocklyVariables.map((v) =>
    transformVariable(v),
  );
  const newTimeline: Timeline = {
    iteration: previousFrame.timeLine.iteration + 1,
    function: "loop",
  };
  const frames = generateInputFrame(
    arduinoLoopBlock,
    blocks,
    electroBlocksVariables,
    newTimeline,
    "loop",
    getPreviousState(blocks, newTimeline, previousFrame, "", false),
  );

  return frames;
};

const generateFramesWithLoop = (
  event: BlockEvent,
  previousFrame: ArduinoFrame,
  loopTimes: number,
  sensorDataString = "",
  isRealTime = false,
  realTimeLoopNumber = 1
): ArduinoFrame[] => {
  const { blocks } = event;
  const arduinoLoopBlock = findArduinoLoopBlock(blocks);
  let stopAllFrames = false;
  let framesWithLoop = _.range(1, loopTimes + 1).reduce(
    (prevFrames, loopTime) => {
      if (stopAllFrames) {
        return prevFrames;
      }
      const timeLine: Timeline = {
        iteration: isRealTime ? realTimeLoopNumber : loopTime,
        function: isRealTime ? "realtime" : "loop",
      };
      const previousFrame = _.isEmpty(prevFrames)
        ? undefined
        : prevFrames[prevFrames.length - 1];
      const defaultComponents = defaultComponentsWithNoSetupBlocks(blocks);
      const frames = generateInputFrame(
        arduinoLoopBlock,
        blocks,
        event.variables,
        timeLine,
        "loop",
        getPreviousState(
          blocks,
          timeLine,
          _.cloneDeep(previousFrame),
          sensorDataString,
          isRealTime
        ), // Deep clone to prevent object memory sharing
        defaultComponents
      );

      if (frames.length > 0 && frames[frames.length - 1].frameNumber > 5000) {
        stopAllFrames = true;
        alert(`Reached maximun steps for simulation.`);
        const count = prevFrames.length;
        const leftTo5000 = 5000 - count;
        // minus 1 because we are starting from 0 index
        return [...prevFrames, ...frames.slice(0, leftTo5000)];
      }

      return [...prevFrames, ...frames];
    },
    [previousFrame]
  );
  // Remove the first frame because it's presetup or undefined because there was no setup blocks.
  framesWithLoop.shift();
  return framesWithLoop;
};

const generatePreLoopFrames = (
  event: BlockEvent,
  sensorDataStr = ""
): ArduinoFrame[] => {
  const { blocks } = event;

  const preSetupBlockType = [
    BlockType.SENSOR_SETUP,
    BlockType.SETUP,
    BlockType.LIST_CREATE,
  ];

  const preSetupBlocks = blocks.filter((b) =>
    preSetupBlockType.includes(b.type)
  );

  const frames: ArduinoFrame[] = preSetupBlocks.reduce((prevFrames, block) => {
    const frame =
      prevFrames.length === 0
        ? undefined
        : _.cloneDeep(prevFrames[prevFrames.length - 1]);
    const previousFrame = getPreviousState(
      blocks,
      { function: "pre-setup", iteration: 0 },
      frame,
      sensorDataStr
    );

    return [
      ...prevFrames,
      ...generateFrame(
        blocks,
        block,
        event.variables,
        { iteration: 0, function: "pre-setup" },
        previousFrame
      ),
    ];
  }, []);

  const arduinoSetupBlock = findArduinoSetupBlock(blocks);

  const previousFrame = _.isEmpty(frames)
    ? undefined
    : frames[frames.length - 1];

  const setupFrames = arduinoSetupBlock
    ? generateInputFrame(
        arduinoSetupBlock,
        blocks,
        event.variables,
        { iteration: 0, function: "setup" },
        "setup",
        getPreviousState(
          blocks,
          { iteration: 0, function: "pre-setup" },
          previousFrame
        )
      )
    : [];

  setupFrames.forEach((f) => frames.push(f));
  return frames;
};

const getPreviousState = (
  blocks: BlockData[],
  timeline: Timeline,
  previousFrame: ArduinoFrame = undefined,
  sensorDataString = "",
  isRealTime = false
): ArduinoFrame => {
  if (previousFrame === undefined) {
    return undefined;
  }

  if (isRealTime) {
    const nonSensorComponent = (
      previousFrame as ArduinoFrame
    ).components.filter(
      // Message components will not sense anything in the real time mode because python is taking up the circuit
      // It is a sensor block for the virtual circuit where block data is used.
      (c) =>
        !isSensorComponent(c) ||
        c.type == ArduinoComponentType.MESSAGE ||
        c.type == ArduinoComponentType.TIME
    );
    const newComponents = [
      ...nonSensorComponent,
      ...convertArduinoStringToSensorState(blocks, sensorDataString),
    ];
    const timeComponent = newComponents.find(
      (x) => x.type == ArduinoComponentType.TIME
    ) as TimeState;
    if (timeComponent) {
      const timeSetupBlock = getBlockByType("time_setup");
      timeComponent.timeInSeconds =
        +timeSetupBlock.getFieldValue("time_in_seconds") * timeline.iteration;
    }
    return { ...previousFrame, components: newComponents };
  }

  const nonSensorComponent = (previousFrame as ArduinoFrame).components.filter(
    (c) => !isSensorComponent(c)
  );
  const sensorSetupBlocks = blocks.filter((b) =>
    sensorSetupBlockName.includes(b.blockName)
  );
  const newComponents = [
    ...nonSensorComponent,
    ...sensorSetupBlocks.map((b) => convertToState(b, timeline)),
  ];

  return { ...previousFrame, components: newComponents };
};

const isSensorComponent = (component: ArduinoComponentState) => {
  {
    return SENSOR_COMPONENTS.includes(component.type);
  }
};
