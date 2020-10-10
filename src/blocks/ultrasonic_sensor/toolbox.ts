import { COLOR_THEME } from "../../core/blockly/constants/colors";

export default `
<category name="Motion" colour="${COLOR_THEME.SENSOR}" >
       <block type="ultra_sonic_sensor_setup">
         <field name="PIN_TRIG">11</field>
         <field name="PIN_ECHO">10</field>
       </block>
       <block type="ultra_sonic_sensor_motion"></block>
       </category>
`;
