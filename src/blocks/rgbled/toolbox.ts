import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="RGB LED" colour="${COLOR_THEME.COMPONENTS}">
   
   <block type="rgb_led_setup">
    <comment pinned="false" h="100" w="460">This block tells the Arduino which pin to use for each color.   RGB stands for red, green, and blue.  By combining colors, you can make other colors.</comment>

                         <field name="PIN_RED_1">11</field>
                         <field name="PIN_GREEN_1">10</field>
                         <field name="PIN_BLUE_1">9</field>
                         <field name="PIN_RED_2">6</field>
                         <field name="PIN_GREEN_2">5</field>
                         <field name="PIN_BLUE_2">3</field>

 </block>
 <block type="set_simple_color_led"></block>

   <block type="set_color_led">
      <comment pinned="false" h="130" w="460">Set the RGB LED colour.</comment>

                  <value name="COLOR">
           <block type="color_picker_custom"> </block>
         </value>

   </value>
   </block>

   </category>`;
