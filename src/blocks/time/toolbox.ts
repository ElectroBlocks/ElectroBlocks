import { COLOR_THEME } from "../../core/blockly/constants/colors";

export const DELAY_COMMENT = `This block pauses the Arduino for x number of seconds.  Nothing will be able to be sensed while the delay is running.`;

export default `<category colour="${COLOR_THEME.ARDUINO}" name="Time">
   <block type="time_setup">
   <comment pinned="false" h="80" w="460">This block sets up how much time will pass in the virtual circuit per loop.</comment>
   </block>
   <block type="delay_block">
      <comment pinned="false" h="90" w="460">
      ${DELAY_COMMENT}</comment>

   <value name="DELAY">

       <block type="math_number">
           <field name="NUM">0.2</field>
       </block>
   </value>
   </block>
   <block type="time_seconds">
      <comment pinned="false" h="80" w="460">Gets the number of seconds the arduino has been turned on.</comment>

   </block>

   </category>`;
