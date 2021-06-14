import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="NeoPixels" colour="${COLOR_THEME.COMPONENTS}">
       <block type="neo_pixel_setup">
              <comment pinned="false" h="110" w="460">This block tells the Arduino which analog pin to use to use for sending data to the neopixels.  The analog pins are usually labeled with A1, A2, A2, etc.</comment>

             <field name="PIN">A0</field>
       </block>
       <block type="neo_pixel_set_color">
              <comment pinned="false" h="80" w="460">This block will set the color of one led in your neopixel light strip.  This block uses 1 as the first neopixel.</comment>

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
