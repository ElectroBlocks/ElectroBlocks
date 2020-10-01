import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `<category name="IR Remote" colour="${COLOR_THEME.SENSOR}" >
       <block type="ir_remote_setup"></block>
       <block type="ir_remote_has_code_receive"></block>
       <block type="ir_remote_get_code"></block>
      </category>`;
