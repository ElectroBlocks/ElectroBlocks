import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Message" colour="${COLOR_THEME.ARDUINO}">
   <block type="message_setup"></block>
   <block type="arduino_send_message">
   <value name="MESSAGE">
                   <block type="text">
                       <field name="TEXT">Hi</field>
                   </block>
               </value>
   </block>
   <block type="arduino_get_message"></block>
   <block type="arduino_receive_message"></block>
   </category>
`;
