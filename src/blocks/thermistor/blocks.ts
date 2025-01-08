import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.Blocks["thermistor_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/thermistor/thermistor.svg", 15, 15)
      )
      .appendField("Thermistor Setup");
    this.appendDummyInput()
      .appendField("Analog Pin #")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().analogPins),
        "PIN"
      );
    this.appendDummyInput().appendField("------------------------------");
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), "LOOP");
    this.appendDummyInput()
      .appendField("Temperature in °C")
      .appendField(new Blockly.FieldNumber(23, -500, 500), "TEMP");
      
    this.appendDummyInput("COPY_ALL")
      .appendField("Copy All: ")
      .appendField(new Blockly.FieldCheckbox(false), "COPY_SAME");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["thermistor_read"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/thermistor/thermistor.svg", 15, 15)
      )
      .appendField("Read Temperature in ")
      .appendField(
        new Blockly.FieldDropdown([
          ["°C", "C"],
          ["°F", "F"],
        ]),
        "UNIT"
      );
    this.setOutput(true, "Number");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
