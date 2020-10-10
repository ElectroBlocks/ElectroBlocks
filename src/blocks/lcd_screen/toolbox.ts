import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category colour="${COLOR_THEME.COMPONENTS}" name="LCD Screen">
   <block type="lcd_setup"></block>
   <block type="lcd_screen_simple_print">
   <value name="ROW_1">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="ROW_2">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="ROW_3">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="ROW_4">
                   <block type="text">
                       <field name="TEXT"></field>
                   </block>
               </value>
               <value name="DELAY">
                   <block type="math_number">
                       <field name="NUM">3</field>
                   </block>
               </value>
   </block>
   <block type="lcd_screen_print">
   <value name="ROW">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="COLUMN">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="PRINT">
                   <block type="text">
                       <field name="TEXT">Hi</field>
                   </block>
               </value>
   </block>
   <block type="lcd_screen_clear"></block>
   <block type="lcd_scroll"></block>
   <block type="lcd_blink">
   <value name="ROW">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
               <value name="COLUMN">
                   <block type="math_number">
                       <field name="NUM">1</field>
                   </block>
               </value>
   </block>
   <block type="lcd_backlight"></block>
   </category>
   `;
