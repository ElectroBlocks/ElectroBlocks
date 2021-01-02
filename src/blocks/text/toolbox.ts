import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Text" colour="${COLOR_THEME.VALUES}">
   <block type="text"></block>
   <block type="text_join">
      <comment pinned="false" h="60" w="460">Turns multiple text blocks into one text block.</comment>
   </block>
   <block type="text_length">
   <comment pinned="false" h="80" w="460">Gets the number of letters inside a text block.  For example, a text block that stores “amy” will return 3.</comment>
     <value name="VALUE">
       <block type="text">
         <field name="TEXT">abc</field>
       </block>
     </value>
   </block>
   <block type="parse_string_block">
   <comment pinned="false" h="220" w="460">This block will break a text block into sections and return one of those sections.  It separates a text block is by the separating character.  

Let’s say you have a text block that stores “12-0-40” and your separating character is “-”.  If you put 1 for the position, it will return 12.  If you want 40, you pass in 2 for the position.</comment>

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
   <comment pinned="false" h="190" w="460">This block turns a number into a text block.  The precision controls how many decimal places of the number will be turned into text.    
   
Let’s say you have 5.23234, and you specify 2 for the precision.  The text block that this block would return “5.23”.</comment>
     <value name="NUMBER">
       <block type="math_number">
         <field name="NUM">5.23234</field>
       </block>
     </value>
   </block>
   <block type="text_isEmpty">
   <comment pinned="false" h="60" w="460">Returns true if nothing is inside the text block.</comment>
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
