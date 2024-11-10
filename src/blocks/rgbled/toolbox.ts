import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="RGB LED" colour="${COLOR_THEME.COMPONENTS}">
   
   <block type="rgb_led_setup">
    <comment pinned="false" h="100" w="460">This block tells the Arduino which pin to use for each color.   RGB stands for red, green, and blue.  By combining colors, you can make other colors.</comment>

                         <field name="PIN_RED_1">6</field>
                         <field name="PIN_GREEN_1">5</field>
                         <field name="PIN_BLUE_1">3</field>
                         <field name="PIN_RED_2">11</field>
                         <field name="PIN_GREEN_2">10</field>
                         <field name="PIN_BLUE_2">9</field>
 </block>

   <block type="set_color_led">
      <comment pinned="false" h="130" w="460">This block sets the color of an RGB led.  RGB stands for red, green, and blue.  To use a custom color, go to the toolbox under data->color and select the biggest block.  Then google RGB color picker to try different colors.</comment>

                  <value name="COLOR">
           <block type="color_picker_custom"> </block>
         </value>

   </value>
   </block>
   </category>`;
