import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Temp" colour="${COLOR_THEME.SENSOR}"  >
         <block type="temp_setup"></block>
         <block type="temp_get_temp"></block>
         <block type="temp_get_humidity"></block>
       </category>
`;
