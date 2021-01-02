import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Message" colour="${COLOR_THEME.ARDUINO}">
   <block type="message_setup">
    <comment pinned="false" h="100" w="460">This block allows you to send messages from the Arduino and the Arduino to send your computer messages.</comment>

   </block>
   <block type="arduino_send_message">
       <comment pinned="false" h="80" w="460">This block will send a message from the Arduino to the computer.</comment>

        <value name="MESSAGE">
            <block type="text">
                <field name="TEXT">Hi</field>
            </block>
        </value>
   </block>
   <block type="arduino_get_message">
    <comment pinned="false" h="80" w="460">Returns the message the Arduino received from the computer.</comment>
   </block>
   <block type="arduino_receive_message">
       <comment pinned="false" h="80" w="460">Returns true if the Arduino is receiving a message.</comment>

   </block>
   </category>
`;
