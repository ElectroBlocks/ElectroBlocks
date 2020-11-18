import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { COLOR_THEME } from "../../core/blockly/constants/colors";


Blockly.Blocks["lcd_screen_clear"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15)
      )
      .appendField("LCD Clear");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "This block clears all the text on the LCD Screen."
    );
    this.comment.setBubbleSize(553, 60);

  },
};

Blockly.Blocks["lcd_screen_print"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15))
      .appendField("LCD Print");
    this.appendValueInput("ROW")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Row");
    this.appendValueInput("COLUMN")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Column");
    this.appendValueInput("PRINT")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Message");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "This block prints something on the LCD screen.  The column number controls the x position, and the row number controls the y.  X means left to right, and Y means up and down.\n\nFor Y, as you go down, the numbers go up.  So the first column is 1, and the next column down is 2."
    );
    this.comment.setBubbleSize(553, 150);
  },
};

Blockly.Blocks["lcd_backlight"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15))
      .appendField("LCD turn backlight")
      .appendField(
        new Blockly.FieldDropdown([
          ["on", "ON"],
          ["off", "OFF"],
        ]),
        "BACKLIGHT"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");

    this.setCommentText(
      "This block turns on and off the backlight in the LCD Screen."
    );
    this.comment.setBubbleSize(553, 60);
  },
};

Blockly.Blocks["lcd_screen_simple_print"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15))
      .appendField("LCD Print  ->  Delay ->  Clear");
    this.appendValueInput("ROW_1")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Print on Row 1");
    this.appendValueInput("ROW_2")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Print on Row 2");
    this.appendValueInput("ROW_3")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Print on Row 3");
    this.appendValueInput("ROW_4")
      .setCheck("String")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Print on Row 4");
    this.appendValueInput("DELAY")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Seconds to show");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "Prints something on the LCD screens and then clears it off.  The “Seconds to show” block is how many seconds the LCD Screen will display the message."
    );
    this.comment.setBubbleSize(553, 120);
  },
};

Blockly.Blocks["lcd_blink"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15))
      .appendField("LCD")
      .appendField(
        new Blockly.FieldDropdown([
          ["Blink", "BLINK"],
          ["No Blink", "OFF"],
        ]),
        "BLINK"
      );
    this.appendValueInput("ROW")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Row");
    this.appendValueInput("COLUMN")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Column");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "This block turns on or off the blinking space on the LCD screen."
    );
    this.comment.setBubbleSize(553, 60);
  },
};


Blockly.Blocks["lcd_scroll"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15))
      .appendField("LCD move everything 1 space")
      .appendField(
        new Blockly.FieldDropdown([
          ["RIGHT", "RIGHT"],
          ["LEFT", "LEFT"],
        ]),
        "DIR"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(`This block shifts all the text to the left or right.`);
    this.comment.setBubbleSize(553, 70);
  },
};

Blockly.Blocks["lcd_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/lcd/lcd.png", 15, 15))
      .appendField("Setup LCD");
    this.appendDummyInput()
      .appendField("Memory Type")
      .appendField(
        new Blockly.FieldDropdown([
          ["0x3F", "0x3F"],
          ["0x27", "0x27"],
        ]),
        "MEMORY_TYPE"
      );
    this.appendDummyInput()
      .appendField("Size")
      .appendField(
        new Blockly.FieldDropdown([
          ["16 x 2", "16 x 2"],
          ["20 x 4", "20 x 4"],
        ]),
        "SIZE"
      );
    this.appendDummyInput()
      .appendField("SDA")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().sdaPins),
        "PIN_SDA"
      )
      .appendField("SCL")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().sclPins),
        "PIN_SCL"
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(`This block sets up the LCD screen.  

The chip determines the memory type.  Check where you purchased your chip; if you don’t know, try both, and it will be easy to see.

For the size we the first number is the width, and the second number is the height.  16 x 2, 16 would be spaces left to right, and 2 would be 2 spaces up and down.
`);
    
    this.comment.setBubbleSize(553, 190);

  },
};
