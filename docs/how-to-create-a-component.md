# How to create a Sensor Component

1\. Create a new folder named after the component you want to create.

2\. Insert art files and svg files into the folder.

3\. Save the block image icon into static/blocks/{nameofcomponent}/{nameofcomponent}.{extension}

4\. Create a blocks.ts file with all your block definitions.

5\. Import the block file into src -> core -> blockly -> blocks.ts

6\. Go to the ArduinoComponentType and add your component to the enum. Then add it to SENSOR_TYPE array as well.

7\. Add your sensor and component state in a file called state.ts.

8\. Add the blocks you created to a pin category. You are looking for the block.type.ts.

- PinCategory Enum
- standlone blocks
- setup blocks
- sensor blocks
- blocksToBlockTypes

9\. Add add a blocktoframe.test.ts file.

```ts
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { ThermistorState } from "./state";

describe("Thermistors Frames and Values", () => {
  let workspace: Workspace;
  let thermistorSetupBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    thermistorSetupBlock = workspace.newBlock("thermistor_setup");
    thermistorSetupBlock.setFieldValue("A4", "PIN");
  });

  it("should be able generate state for thermistor block.", () => {
    saveLoopData(10, thermistorSetupBlock, 1);
    saveLoopData(104, thermistorSetupBlock, 2);
    saveLoopData(204, thermistorSetupBlock, 3);

    const sensorBlock = workspace.newBlock("thermistor_read");

    const setVarNumBlock = createSetVariableBlockWithValue(
      workspace,
      "temp",
      VariableTypes.NUMBER,
      0
    );
    setVarNumBlock.getInput("VALUE").connection.targetBlock().dispose(true);

    setVarNumBlock
      .getInput("VALUE")
      .connection.connect(sensorBlock.outputConnection);

    connectToArduinoBlock(setVarNumBlock);

    const event = createTestEvent(setVarNumBlock.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;

    // setup block
    verifyState(state1, 10);
    // first loop
    verifyState(state2, 10);
    // second loop
    verifyState(state3, 104);
    // third loop
    verifyState(state4, 204);
  });
});

const saveLoopData = (temp: number, block: BlockSvg, loop: number) => {
  block.setFieldValue(loop.toString(), "LOOP");
  block.setFieldValue(temp.toString(), "TEMP");

  const event = createTestEvent(block.id);

  saveSensorSetupBlockData(event).forEach(updater);
};

const verifyState = (state: ArduinoFrame, temp: number) => {
  const [component] = state.components as ThermistorState[];
  expect(component.type).toBe(ArduinoComponentType.THERMISTOR);
  expect(component.pins).toEqual(["A0"]);
  expect(component.temp).toBe(temp);
};
```

10\. Create the setupblocktosensordata.ts file and create a function that will return Sensor data. This will take the setup block and create somethign so save into json. The field names need to match your block names.

```ts
export const thermistorSetupBlockToSensorData = (
  block: BlockData
): ThermistorSensor => {
  return {
    temp: +findFieldValue(block, "TEMP"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
```

11\. Next add setup block name and function to the (`sensor-data.transformer.ts`) blockToSensorData object. This contains a list of setup blocks types and the functions to save turn them into json to be saved in the block.

12\. Create a setupblocktocomponentstat.ts file that will contain a function that takes in blockdata and timeline and return the state of the sensor.

```
export const thermistorSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): ThermistorState => {
  const sensorData = findSensorState<ThermistorSensor>(block, timeline);

  return {
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    temp: sensorData.temp,
  };
};
```

13\. Next add setup block name and function to the (`sensor-data.transformer.ts`) blockToSensorComponent object. This contains a list of setup blocks types and the functions to save turn them into json to be saved in the block.

14\. Add a blocktoframe.ts file. This will store all your blocks that produce frames.

```ts
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ThermistorSensor, ThermistorState } from "./state";

export const thermistorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as ThermistorSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as ThermistorSensor;

  const thermistorState: ThermistorState = {
    pins: block.pins,
    type: ArduinoComponentType.THERMISTOR,
    temp: sensorData.temp,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      thermistorState,
      "Setting up Thermistor",
      previousState
    ),
  ];
};
```

15\. Add the function to the core -> frames -> transformers -> block-to-frame.transformer.ts file.

16\. Add a file named blocktovalue.ts and create functions that will get the sensor data.

```ts
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ThermistorState } from "./state";

export const thermistorTemp: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ThermistorState>(
    previousState,
    ArduinoComponentType.THERMISTOR
  ).temp;
};
```

17\. Add it to the block-to-value.transformer.ts

18\. Run the test file to make sure everything working.

19\. Add a file called toolbox.ts and put in the toolbox. Besure you put in comments for what each block does.

```ts
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `
<category name="Thermistor" colour="${COLOR_THEME.SENSOR}" >
       <block type="thermistor_setup">
       <comment pinned="false" h="180" w="460">This block will setup the thermistor which is used to measure temperature.${virtualCircuitComment}</comment>
         <field name="PIN">AO</field>
       </block>
       <block type="thermistor_read">
        <comment pinned="false" h="60" w="460">Return the temperature in Celcius.</comment>
       </block>
       </category>
`;
```

20\. Add it to the toolbox under sensors.

21\. Run npm run dev to see your blocks. Go ahead and test out the comments even though there will be a ton of errors.

22\. Add svg string to svg-string.ts to get the svg

23\. Add entry into arduino-components-id.ts

24\. Create the file and add virtual circuit

25\. Hookup svg-create and svg-sync ts file with new functions.
