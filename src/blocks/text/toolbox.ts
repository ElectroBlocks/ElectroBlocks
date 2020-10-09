import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Text" colour="${COLOR_THEME.VALUES}">
   <block type="text"></block>
   <block type="text_join"></block>
   <block type="text_length">
     <value name="VALUE">
       <block type="text">
         <field name="TEXT">abc</field>
       </block>
     </value>
   </block>
   <block type="parse_string_block">
     <value name="VALUE">
       <block type="text">
         <field name="TEXT">blue,red,green</field>
       </block>
     </value>
     <value name="POSITION">
       <block type="math_number">
         <field name="NUM">1</field>
       </block>
     </value>
   </block>

   <block type="number_to_string">
     <value name="VALUE">
       <block type="math_number">
         <field name="NUM">1</field>
       </block>
     </value>
   </block>
   <block type="text_isEmpty">
     <value name="VALUE">
       <block type="text">
         <field name="TEXT"></field>
       </block>
     </value>
   </block>
   <block type="text_changeCase">
     <value name="TEXT">
       <block type="text">
         <field name="TEXT">abc</field>
       </block>
     </value>
   </block>
   </category>
`;
