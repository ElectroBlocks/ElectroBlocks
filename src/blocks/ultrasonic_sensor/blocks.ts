import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import loopTimes from "../../core/blockly/helpers/looptimes";
Blockly.defineBlocksWithJsonArray([
  {
    type: "ultra_sonic_sensor_motion",
    message0: "%1 distance (cm).",
    args0: [
      {
        type: "field_image",
        src: "./blocks/motion_sensor/ultrasonic_sensor.png",
        width: 30,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "Number",
    colour: COLOR_THEME.SENSOR,
    tooltip: "",
    helpUrl: "",
  },
]);

const ultraSonicSensorBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "./blocks/motion_sensor/ultrasonic_sensor.png",
          30,
          15
        )
      )
      .appendField("Setup Ultrasonic Sensor");
    this.appendDummyInput()
      .appendField("Trig Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_TRIG"
      )
      .appendField("Echo Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_ECHO"
      );
    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "------------------------------------------------"
    );
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), "LOOP");
    this.appendDummyInput()
      .appendField("Distance In CMs")
      .appendField(new Blockly.FieldNumber(1, 0.1, 500, 0.00001), "cm");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["ultra_sonic_sensor_setup"] = ultraSonicSensorBlock;
