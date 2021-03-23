import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { whatIsAPin } from "../comment-text";

export const LED_COMMENT = `Turn on or off the led attached to the pin in the dropdown box.${whatIsAPin}`;

export default `<category name="Led" colour="${COLOR_THEME.COMPONENTS}">
   <block type="led">
    <comment pinned="false" h="145" w="460" >${LED_COMMENT}</comment>
   </block>

   <block type="led_fade">
    <comment pinned="false" h="175" w="460" >This block controls the amount of electricity going into the led attached to the pin in the dropdown box.  It has a fade effect on the led light.${whatIsAPin}</comment>
   <value name="FADE">
                   <block type="math_number">
                       <field name="NUM">125</field>
                   </block>
               </value>
   </block>
</category>`;
