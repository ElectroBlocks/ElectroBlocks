import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";

export default `<category name="JoyStick" colour="${COLOR_THEME.SENSOR}">
   <block type="joystick_setup">
    <field name="PIN_X">A1</field>
    <field name="PIN_Y">A3</field>
    <field name="PIN_BUTTON">9</field>

    <comment pinned="false" h="400" w="460" >Pin X and Pin Y are used to sense the where the joy stick is position.  Button pin is used sense whether joystick is being pressed.
    ${whatIsAPin}${virtualCircuitComment}
    </comment>
   </block>

    <block type="joystick_angle">
            <comment pinned="false" h="70" w="460" >Return the angle the joystick is positioned in.
        </comment>
    </block>

    <block type="joystick_engaged">
            <comment pinned="false" h="80" w="460" >Returns whether true if someone is moving the joystick to a position.
        </comment>
    </block>
   <block type="joystick_button">
            <comment pinned="false" h="80" w="460" >Returns whether true if someone is pressing down on the joystick.
        </comment>
    </block>
</category>`;
