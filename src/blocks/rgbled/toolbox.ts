import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="RGB LED" colour="${COLOR_THEME.COMPONENTS}">
   
   <block type="rgb_led_setup">
    <comment pinned="false" h="100" w="460">This block tells the Arduino which pin to use for each color.   RGB stands for red, green, and blue.  By combining colors, you can make other colors.</comment>

                           <field name="PIN_RED">11</field>
                         <field name="PIN_GREEN">10</field>
                         <field name="PIN_BLUE">9</field>
 </block>

   <block type="set_color_led">
      <comment pinned="false" h="130" w="460">Set the RGB LED colour.</comment>

   <value name="COLOUR">

                   <block type="color_picker_custom">
                   </block>
   </value>
   </block>
   </category>`;
