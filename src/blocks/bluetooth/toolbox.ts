import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment } from "../comment-text";

export default `<category name="Bluetooth" colour="${COLOR_THEME.COMPONENTS}">
  <block type="bluetooth_setup">
      <comment pinned="false" h="150" w="460">This block (Bluetooth setup block) tells the Arduino we are using Bluetooth devices.${virtualCircuitComment}</comment>

    <field name="PIN_RX">11</field>
    <field name="PIN_TX">10</field>
  </block>
  <block type="bluetooth_send_message">
  <comment pinned="false" h="60" w="460">This block sends a message through the Bluetooth.</comment>
    <value name="MESSAGE">
      <block type="text">
        <field name="TEXT">Hi</field>
      </block>
    </value>
  </block>

  <block type="bluetooth_has_message">
    <comment pinned="false" h="60" w="460">Returns true if the Bluetooth has received a message.</comment>

  </block>
  <block type="bluetooth_get_message">
      <comment pinned="false" h="60" w="460">Get's the message that the Bluetooth received.</comment>
  </block>
  </category>`;
