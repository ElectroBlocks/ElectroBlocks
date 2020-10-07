import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category colour="${COLOR_THEME.ARDUINO}" name="Time">
   <block type="time_setup"></block>
   <block type="delay_block">
   <value name="DELAY">
       <block type="math_number">
           <field name="NUM">1</field>
       </block>
   </value>
   </block>
   <block type="time_seconds"></block>

   </category>`;
