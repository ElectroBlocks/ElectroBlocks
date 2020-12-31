import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.defineBlocksWithJsonArray([
  {
    type: "led_matrix_make_draw",
    message0:
      "%1 Led Matrix Draw %2 %3 %4 %5 %6 %7 %8 %9 %10 %11 %12 %13 %14 %15 %16 %17 %18 %19 %20 %21 %22 %23 %24 %25 %26 %27 %28 %29 %30 %31 %32 %33 %34 %35 %36 %37 %38 %39 %40 %41 %42 %43 %44 %45 %46 %47 %48 %49 %50 %51 %52 %53 %54 %55 %56 %57 %58 %59 %60 %61 %62 %63 %64 %65 %66 %67 %68 %69 %70 %71 %72 %73",
    args0: [
      {
        type: "field_image",
        src: "./blocks/led_matrix/led_matrix.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "1,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "1,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "2,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "2,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "3,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "3,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "4,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "4,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "5,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "5,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "6,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "6,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "7,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "7,8",
        checked: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_checkbox",
        name: "8,1",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,2",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,3",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,4",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,5",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,6",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,7",
        checked: false,
      },
      {
        type: "field_checkbox",
        name: "8,8",
        checked: false,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "led_matrix_turn_one_on_off",
    message0: "%1 Turn one led %2 %3 Row %4 Column %5",
    args0: [
      {
        type: "field_image",
        src: "./blocks/led_matrix/led_matrix.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "field_dropdown",
        name: "STATE",
        options: [
          ["on", "ON"],
          ["off", "OFF"],
        ],
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "ROW",
        check: "Number",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "COLUMN",
        check: "Number",
        align: "RIGHT",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
]);

Blockly.Blocks["led_matrix_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/led_matrix/led_matrix.png", 15, 15)
      )
      .appendField("Led Matrix Setup");
    this.appendDummyInput()
      .appendField("Data Pin#")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_DATA"
      );
    this.appendDummyInput()
      .appendField("CLK Pin#")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_CLK"
      );
    this.appendDummyInput()
      .appendField("CS Pin#")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_CS"
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
