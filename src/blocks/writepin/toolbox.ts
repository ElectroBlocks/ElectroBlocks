import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { whatIsAPin } from "../comment-text";

export default `
<category name="Pins" colour="${COLOR_THEME.COMPONENTS}">
   <block type="digital_write">
    <comment pinned="false" h="130" w="460">This block (digital write) turns on and off a pin.${whatIsAPin}</comment>
   </block>
   <block type="analog_write">
    <comment pinned="false" h="200" w="400" >This block (analog write) sends a number from 0 to 255 to a pin.
255 means that pins is completely on while 0 means the pin is off.${whatIsAPin}</comment>
       <value name="WRITE_VALUE">
                   <block type="math_number">
                       <field name="NUM">150</field>
                   </block>
        </value>
    </block>
</category>
`;
