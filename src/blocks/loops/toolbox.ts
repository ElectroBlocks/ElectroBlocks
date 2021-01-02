import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="Loops" colour="${COLOR_THEME.CONTROL}">
     <block type="controls_repeat_ext">
       <value name="TIMES">
         <block type="math_number">
           <field name="NUM">10</field>
         </block>
       </value>
     </block>
     <block type="controls_for">
         <comment pinned="false" h="140" w="460">A for "count with block" creates a loop where it will stop looping once the variable has reached the "to" point.  The best way to learn this block is to drag it out and play around with its values in the simulator.</comment>

       <value name="FROM">
         <block type="math_number">
           <field name="NUM">1</field>
         </block>
       </value>
       <value name="TO">
         <block type="math_number">
           <field name="NUM">10</field>
         </block>
       </value>
       <value name="BY">
         <block type="math_number">
           <field name="NUM">1</field>
         </block>
       </value>
     </block>
   </category>
`;
