import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="Loops" colour="${COLOR_THEME.CONTROL}">
     <block type="controls_repeat_ext">
     <comment pinned="false" h="130" w="460">The loop block runs on repeat until your Arduino loses power. It runs right after your setup block if you have one. If you are using the simulator, you can control how many times it repeats.</comment>

       <value name="TIMES">
         <block type="math_number">
           <field name="NUM">10</field>
         </block>
       </value>
     </block>
     <block type="controls_for">
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
