import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="FastLED" colour="${COLOR_THEME.COMPONENTS}">
       <block type="fastled_setup">
              <comment pinned="false" h="110" w="460">This block tells the Arduino which analog pin to use to use for sending data to the pixels.  The analog pins are usually labeled with A1, A2, A2, etc.</comment>

             <field name="PIN">5</field>
       </block>
       <block type="fastled_set_all_colors">
                     <comment pinned="false" h="80" w="460">This block will set all the colors on the neopixels.</comment>
       </block>
       <block type="fastled_show_all_colors">
          <comment pinned="false" h="80" w="460">Use the block to display all RGB LED Strips</comment>
       </block>
       <block type="fastled_set_color">
              <comment pinned="false" h="80" w="460">This block will set the color of one led in your fastled light strip.  This block uses 1 as the first pixel.</comment>

         <value name="POSITION">
           <block type="math_number">
             <field name="NUM">1</field>
           </block>
         </value>
         <value name="COLOR">
           <block type="color_picker_custom"> </block>
         </value>
       </block>
   </category>`;
