import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Math" colour="${COLOR_THEME.VALUES}">
     <block type="math_number">
       <field name="NUM">123</field>
     </block>
     <block type="math_number_property">
     <value name="NUMBER_TO_CHECK">
         <block type="math_number">
           <field name="NUM">3</field>
         </block>
       </value>
    </block>
     <block type="math_arithmetic">
       <value name="A">
         <block type="math_number">
           <field name="NUM">1</field>
         </block>
       </value>
       <value name="B">
         <block type="math_number">
           <field name="NUM">1</field>
         </block>
       </value>
     </block>
     <block type="string_to_number">
          <comment pinned="false" h="60" w="460">This block will take text data and turn it into number.</comment>

       <value name="VALUE">
         <block type="text">
           <field name="TEXT">5.35</field>
         </block>
       </value>
     </block>

     <block type="math_round">
       <value name="NUM">
         <block type="math_number">
           <field name="NUM">3.1</field>
         </block>
       </value>
     </block>
     <block type="math_modulo">
       <value name="DIVIDEND">
         <block type="math_number">
           <field name="NUM">64</field>
         </block>
       </value>
       <value name="DIVISOR">
         <block type="math_number">
           <field name="NUM">10</field>
         </block>
       </value>
     </block>
     <block type="math_random_int">
       <value name="FROM">
         <block type="math_number">
           <field name="NUM">1</field>
         </block>
       </value>
       <value name="TO">
         <block type="math_number">
           <field name="NUM">100</field>
         </block>
       </value>
     </block>
   </category>
`;
