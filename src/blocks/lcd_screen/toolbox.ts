import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category colour="${COLOR_THEME.COMPONENTS}" name="LCD Screen">
   <block type="lcd_setup">
    <comment pinned="false" h="240" w="460">This block sets up the LCD screen.

The chip determines the memory type.  Check where you purchased your chip; if you don’t know, try both, and it will be easy to see.

For the size we the first number is the width, and the second number is the height.  16 x 2, 16 would be spaces left to right, and 2 would be 2 spaces up and down.</comment>
   </block>
   <block type="lcd_screen_simple_print">
    <comment pinned="false" h="120" w="460">Prints something on the LCD screens and then clears it off.  The "Seconds to show" block is how many seconds the LCD Screen will display the message.</comment>
   <value name="ROW_1">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="ROW_2">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="ROW_3">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="ROW_4">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="DELAY">
                   <block type="math_number">
                       <field name="NUM">3</field>
                   </block>
               </value>
   </block>
   <block type="lcd_screen_print">
   <comment pinned="false" h="190" w="460">This block prints something on the LCD screen.  The column number controls the x position, and the row number controls the y.  X means left to right, and Y means up and down.
   
For Y, as you go down, the numbers go up.  So the first column is 1, and the next column down is 2.</comment>
   <value name="ROW">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="COLUMN">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="PRINT">
                   <block type="text">
                       <field name="TEXT">Hi</field>
                   </block>
               </value>
   </block>
   <block type="lcd_screen_clear">
        <comment pinned="false" h="60" w="460">This block clears all the text on the LCD Screen.</comment>
   </block>
   <block type="lcd_scroll">
    <comment pinned="false" h="70" w="460">This block shifts all the text to the left or right.</comment>
   </block>
   <block type="lcd_blink">
        <comment pinned="false" h="80" w="460">This block turns on or off the blinking space on the LCD screen.</comment>
   <value name="ROW">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="COLUMN">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
   </block>
   <block type="lcd_backlight">
    <comment pinned="false" h="80" w="460">This block turns on and off the backlight in the LCD Screen.</comment>
   </block>
   </category>
   `;
