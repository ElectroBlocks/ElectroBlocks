import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="RGB LED" colour="${COLOR_THEME.COMPONENTS}">
   
   <block type="rgb_led_setup">
    <comment pinned="false" h="90" w="460">This block tells the Arduino which pin to use for each color.   RGB stands for red, green, and blue.  By combining colors, you can make other colors.</comment>

                           <field name="PIN_RED">6</field>
                         <field name="PIN_GREEN">5</field>
                         <field name="PIN_BLUE">3</field>
 </block>

   <block type="set_color_led">
      <comment pinned="false" h="110" w="460">This block sets the color of an RGB led.  RGB stands for red, green, and blue.  To use a custom color, go to the toolbox under data->color and select the biggest block.  Then google RGB color picker to try different colors.</comment>

   <value name="COLOUR">

                   <block type="colour_picker">
                   </block>
   </value>
   </block>
   </category>`;
