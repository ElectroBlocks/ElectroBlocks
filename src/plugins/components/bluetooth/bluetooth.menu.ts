import { COLOR_THEME } from "../../../core/blockly/constants/colors";

export const btXMLString = `<category name="Bluetooth" colour="${COLOR_THEME.COMPONENTS}">
  <block type="bluetooth_setup">
    <field name="PIN_RX">11</field>
    <field name="PIN_TX">10</field>
  </block>
  <block type="bluetooth_send_message">
    <value name="MESSAGE">
      <block type="text">
        <field name="TEXT">Hi</field>
      </block>
    </value>
  </block>

  <block type="bluetooth_has_message"></block>
  <block type="bluetooth_get_message"></block>
  </category>`;

export const BtToolboxName = Symbol("electroblocks_bluetooth");
