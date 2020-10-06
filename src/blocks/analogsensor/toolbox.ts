import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Analog" colour="${COLOR_THEME.SENSOR}" >
       <block type="analog_read_setup"></block>
       <block type="analog_read"></block>
   </category>
`;
