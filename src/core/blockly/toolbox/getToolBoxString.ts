import { COLOR_THEME } from "../constants/colors";
import { ToolBoxCategory, ToolBoxEntries, ToolBoxEntry } from "./toolbox";

/**
 * Turns the toolbox entries into a string
 */
const getToolBoxString = (toolboxOptions: ToolBoxEntries[]): string => {
  let toolbox = `<xml
    xmlns="https://developers.google.com/blockly/xml"
    id="toolbox-simple"
    style="display: none"
  >`;

  toolbox += toolboxOptions.reduce((acc, next) => {
    if (next.category === ToolBoxCategory.NONE) {
      return acc + getMenuItems(next.toolBoxEntries);
    }

    return (
      acc +
      `<category name="${next.name}" colour="${next.color}">
        ${getMenuItems(next.toolBoxEntries)}
      </category>`
    );
  }, "");

  toolbox += `</xml>`;

  return toolbox;
};

function getMenuItems(toolBoxEntries: ToolBoxEntry[]) {
  return toolBoxEntries.reduce((acc, next) => {
    if (next.show) {
      return acc + next.xml;
    }
    return acc;
  }, "");
}

// const getToolBoxString = (toolboxOptions: ToolBoxEntries[]): string => {
//   let toolbox = `<xml
//   xmlns="https://developers.google.com/blockly/xml"
//   id="toolbox-simple"
//   style="display: none"
// >`;

//   if (showToolBoxOption("Logic", toolboxOptions)) {
//     toolbox += `<category name="Logic" colour="${COLOR_THEME.CONTROL}">
//     <block type="control_if"></block>
//     <block type="controls_ifelse"></block>
//     <block type="logic_compare"></block>
//     <block type="logic_operation"></block>
//     <block type="logic_negate"></block>
//     <block type="logic_boolean"></block>
//   </category>`;
//   }

//   if (showToolBoxOption("Loops", toolboxOptions)) {
//     toolbox += `<category name="Loops" colour="${COLOR_THEME.CONTROL}">
//     <block type="controls_repeat_ext">
//       <value name="TIMES">
//         <block type="math_number">
//           <field name="NUM">10</field>
//         </block>
//       </value>
//     </block>
//     <block type="controls_for">
//       <value name="FROM">
//         <block type="math_number">
//           <field name="NUM">1</field>
//         </block>
//       </value>
//       <value name="TO">
//         <block type="math_number">
//           <field name="NUM">10</field>
//         </block>
//       </value>
//       <value name="BY">
//         <block type="math_number">
//           <field name="NUM">1</field>
//         </block>
//       </value>
//     </block>
//   </category>`;
//   }
//   if (showToolBoxOption("Functions", toolboxOptions)) {
//     toolbox += `<category
//     name="My Blocks"
//     colour="${COLOR_THEME.CONTROL}"
//     custom="PROCEDURE"
//   ></category><sep></sep>`;
//   }

//   if (showToolBoxOption("List", toolboxOptions)) {
//     toolbox += `<category name="List" colour="${COLOR_THEME.DATA}" custom="LIST"> </category>`;
//   }

//   if (showToolBoxOption("Variables", toolboxOptions)) {
//     toolbox += `<category name="Variables" colour="${COLOR_THEME.DATA}" custom="VARIABLE"></category>`;
//   }

//   if (
//     showToolBoxOption("List", toolboxOptions) ||
//     showToolBoxOption("Variables", toolboxOptions)
//   ) {
//     toolbox += "<sep></sep>";
//   }

//   toolbox += `<category name="Data" colour="${COLOR_THEME.VALUES}">`;

//   if (showToolBoxOption("Color", toolboxOptions)) {
//     toolbox += `<category name="Color" colour="${COLOR_THEME.VALUES}">
//       <block type="colour_picker"></block>
//       <block type="colour_random"></block>
//       <block type="colour_rgb">
//         <value name="RED">
//           <block type="math_number">
//             <field name="NUM">100</field>
//           </block>
//         </value>
//         <value name="GREEN">
//           <block type="math_number">
//             <field name="NUM">50</field>
//           </block>
//         </value>
//         <value name="BLUE">
//           <block type="math_number">
//             <field name="NUM">0</field>
//           </block>
//         </value>
//       </block>
//     </category>`;
//   }

//   if (showToolBoxOption("Math", toolboxOptions)) {
//     toolbox += `<category name="Math" colour="${COLOR_THEME.VALUES}">
//     <block type="math_number">
//       <field name="NUM">123</field>
//     </block>
//     <block type="math_arithmetic">
//       <value name="A">
//         <block type="math_number">
//           <field name="NUM">1</field>
//         </block>
//       </value>
//       <value name="B">
//         <block type="math_number">
//           <field name="NUM">1</field>
//         </block>
//       </value>
//     </block>
//     <block type="string_to_number">
//       <value name="VALUE">
//         <block type="text">
//           <field name="TEXT">5.35</field>
//         </block>
//       </value>
//     </block>

//     <block type="math_round">
//       <value name="NUM">
//         <block type="math_number">
//           <field name="NUM">3.1</field>
//         </block>
//       </value>
//     </block>
//     <block type="math_modulo">
//       <value name="DIVIDEND">
//         <block type="math_number">
//           <field name="NUM">64</field>
//         </block>
//       </value>
//       <value name="DIVISOR">
//         <block type="math_number">
//           <field name="NUM">10</field>
//         </block>
//       </value>
//     </block>
//     <block type="math_random_int">
//       <value name="FROM">
//         <block type="math_number">
//           <field name="NUM">1</field>
//         </block>
//       </value>
//       <value name="TO">
//         <block type="math_number">
//           <field name="NUM">100</field>
//         </block>
//       </value>
//     </block>
//   </category>`;
//   }

//   if (showToolBoxOption("Text", toolboxOptions)) {
//     toolbox += `
//       <category name="Text" colour="${COLOR_THEME.VALUES}">
//   <block type="text"></block>
//   <block type="text_join"></block>
//   <block type="text_length">
//     <value name="VALUE">
//       <block type="text">
//         <field name="TEXT">abc</field>
//       </block>
//     </value>
//   </block>
//   <block type="parse_string_block">
//     <value name="VALUE">
//       <block type="text">
//         <field name="TEXT">blue,red,green</field>
//       </block>
//     </value>
//     <value name="POSITION">
//       <block type="math_number">
//         <field name="NUM">1</field>
//       </block>
//     </value>
//   </block>

//   <block type="number_to_string">
//     <value name="VALUE">
//       <block type="math_number">
//         <field name="NUM">1</field>
//       </block>
//     </value>
//   </block>
//   <block type="text_isEmpty">
//     <value name="VALUE">
//       <block type="text">
//         <field name="TEXT"></field>
//       </block>
//     </value>
//   </block>
//   <block type="text_changeCase">
//     <value name="TEXT">
//       <block type="text">
//         <field name="TEXT">abc</field>
//       </block>
//     </value>
//   </block>
//   </category>`;
//   }

//   toolbox += "</category><sep></sep>";

//   toolbox += `
//   <category name="Arduino" colour="${COLOR_THEME.ARDUINO}">`;

//   if (showToolBoxOption("Code", toolboxOptions)) {
//     toolbox += `<category name="Code" colour="${COLOR_THEME.ARDUINO}" custom="CODE"></category>`;
//   }

//   if (showToolBoxOption("Message", toolboxOptions)) {
//     toolbox += `<category name="Message" colour="${COLOR_THEME.ARDUINO}">
//   <block type="message_setup"></block>
//   <block type="arduino_send_message">
//   <value name="MESSAGE">
//                   <block type="text">
//                       <field name="TEXT">Hi</field>
//                   </block>
//               </value>
//   </block>
//   <block type="arduino_get_message"></block>
//   <block type="arduino_receive_message"></block>
//   </category>`;
//   }

//   if (showToolBoxOption("Time", toolboxOptions)) {
//     toolbox += `<category colour="${COLOR_THEME.ARDUINO}" name="Time">
//   <block type="time_setup"></block>
//   <block type="delay_block">
//   <value name="DELAY">
//       <block type="math_number">
//           <field name="NUM">1</field>
//       </block>
//   </value>
//   </block>
//   <block type="time_seconds"></block>

//   </category>`;
//   }

//   toolbox += "</category><sep></sep>";
//   toolbox += `<category colour="${COLOR_THEME.COMPONENTS}" name="Components" >`;

//   if (showToolBoxOption("Bluetooth", toolboxOptions)) {
//     toolbox +=
//   }

//   if (showToolBoxOption("LCD Screen", toolboxOptions)) {
//     toolbox += `<category colour="${COLOR_THEME.COMPONENTS}" name="LCD Screen">
//   <block type="lcd_setup"></block>
//   <block type="lcd_screen_simple_print">
//   <value name="ROW_1">
//                   <block type="text">
//                       <field name="TEXT"></field>
//                   </block>
//               </value>
//               <value name="ROW_2">
//                   <block type="text">
//                       <field name="TEXT"></field>
//                   </block>
//               </value>
//               <value name="ROW_3">
//                   <block type="text">
//                       <field name="TEXT"></field>
//                   </block>
//               </value>
//               <value name="ROW_4">
//                   <block type="text">
//                       <field name="TEXT"></field>
//                   </block>
//               </value>
//               <value name="DELAY">
//                   <block type="math_number">
//                       <field name="NUM">3</field>
//                   </block>
//               </value>
//   </block>
//   <block type="lcd_screen_print">
//   <value name="ROW">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//               <value name="COLUMN">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//               <value name="PRINT">
//                   <block type="text">
//                       <field name="TEXT">Hi</field>
//                   </block>
//               </value>
//   </block>
//   <block type="lcd_screen_clear"></block>
//   <block type="lcd_scroll"></block>
//   <block type="lcd_blink">
//   <value name="ROW">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//               <value name="COLUMN">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//   </block>
//   <block type="lcd_backlight"></block>
//   </category>
//   `;
//   }

//   if (showToolBoxOption("Led", toolboxOptions)) {
//     toolbox += `<category name="Led" colour="${COLOR_THEME.COMPONENTS}">
//   <block type="led"></block>

//   <block type="led_fade">
//   <value name="FADE">
//                   <block type="math_number">
//                       <field name="NUM">125</field>
//                   </block>
//               </value>
//   </block>
//   <block type="led_color_setup">
//                           <field name="PIN_RED">6</field>
//                         <field name="PIN_GREEN">5</field>
//                         <field name="PIN_BLUE">3</field>
// </block>

//   <block type="set_color_led">
//   <value name="COLOUR">
//                   <block type="colour_picker">
//                   </block>
//   </value>
//   </block>
//   <block type="digital_write"></block>

//       <block type="analog_write">
//       <value name="WRITE_VALUE">
//                   <block type="math_number">
//                       <field name="NUM">150</field>
//                   </block>
//               </value>
//       </block>
//   </category>
//   `;
//   }

//   if (showToolBoxOption("Led Light Strip", toolboxOptions)) {
//     toolbox += `<category name="Led Light Strip" colour="${COLOR_THEME.COMPONENTS}">
//       <block type="neo_pixel_setup">
//             <field name="PIN">A0</field>
//       </block>
//       <block type="neo_pixel_set_color">
//         <value name="POSITION">
//           <block type="math_number">
//             <field name="NUM">1</field>
//           </block>
//         </value>
//         <value name="COLOR">
//           <block type="colour_picker"> </block>
//         </value>
//       </block>
//   </category>`;
//   }

//   if (showToolBoxOption("Led Matrix", toolboxOptions)) {
//     toolbox += `<category colour="${COLOR_THEME.COMPONENTS}" name="Led Matrix">
//     <block type="led_matrix_setup">
//                           <field name="PIN_DATA">10</field>
//                           <field name="PIN_CLK">12</field>
//                           <field name="PIN_CS">11</field>

//     </block>

//     <block type="led_matrix_make_draw"></block>
//   <block type="led_matrix_turn_one_on_off">
//   <value name="ROW">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//               <value name="COLUMN">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//   </block>
//   </category>`;
//   }

//   if (showToolBoxOption("Motor / Servo", toolboxOptions)) {
//     toolbox += `<category name="Motor / Servo" colour="${COLOR_THEME.COMPONENTS}">
//   <block type="move_motor">
//   <value name="SPEED">
//                   <block type="math_number">
//                       <field name="NUM">250</field>
//                   </block>
//               </value>
//               <value name="MOTOR">
//                   <block type="math_number">
//                       <field name="NUM">1</field>
//                   </block>
//               </value>
//   </block>
//   <block type="rotate_servo">
//   <value name="DEGREE">
//   <block type="math_number">
//       <field name="NUM">50</field>
//   </block>
//   </value>
//   </block>
//   </category>
//   `;
//   }

//   toolbox += "</category><sep></sep>";
//   toolbox += `<category name="Sensors" colour="${COLOR_THEME.SENSOR}">`;

//   if (showToolBoxOption("Analog", toolboxOptions)) {
//     toolbox += `<category name="Analog" colour="${COLOR_THEME.SENSOR}" >
//       <block type="analog_read_setup"></block>
//       <block type="analog_read"></block>
//   </category>`;
//   }

//   if (showToolBoxOption("Buttons", toolboxOptions)) {
//     toolbox += `<category name="Button" colour="${COLOR_THEME.SENSOR}">
//       <block type="button_setup"></block>
//       <block type="is_button_pressed"></block>
//   </category>`;
//   }

//   if (showToolBoxOption("Digital", toolboxOptions)) {
//     toolbox += `<category name="Digital" colour="${COLOR_THEME.SENSOR}">
//       <block type="digital_read_setup"></block>
//       <block type="digital_read"></block>
//   </category>`;
//   }

//   if (showToolBoxOption("IR Remote", toolboxOptions)) {
//     toolbox += `<category name="IR Remote" colour="${COLOR_THEME.SENSOR}" >
//       <block type="ir_remote_setup"></block>
//       <block type="ir_remote_has_code_receive"></block>
//       <block type="ir_remote_get_code"></block>
//       </category>`;
//   }

//   if (showToolBoxOption("Motion", toolboxOptions)) {
//     toolbox += `    <category name="Motion" colour="${COLOR_THEME.SENSOR}" >
//       <block type="ultra_sonic_sensor_setup">
//         <field name="PIN_TRIG">11</field>
//         <field name="PIN_ECHO">10</field>
//       </block>
//       <block type="ultra_sonic_sensor_motion"></block>
//       </category>
//   `;
//   }

//   if (showToolBoxOption("RFID", toolboxOptions)) {
//     toolbox += `    <category name="RFID" colour="${COLOR_THEME.SENSOR}" >
//           <block type="rfid_setup">
//               <field name="PIN_RX">7</field>
//               <field name="PIN_TX">6</field>
//           </block>
//           <block type="rfid_card"></block>
//           <block type="rfid_tag"></block>
//           <block type="rfid_scan"></block>
//       </category>
//   `;
//   }

//   if (showToolBoxOption("Temp", toolboxOptions)) {
//     toolbox += `<category name="Temp" colour="${COLOR_THEME.SENSOR}"  >
//         <block type="temp_setup"></block>
//         <block type="temp_get_temp"></block>
//         <block type="temp_get_humidity"></block>
//       </category>`;
//   }

//   toolbox += `</category></xml>`;

//   return toolbox;
// };

// const showToolBoxOption = (
//   name: symbol,
//   options: ToolBoxEntries[]
// ): boolean => {
//   const selectedOption = options.find((c) => c.name === name);

//   return selectedOption !== undefined && selectedOption.show;
// };

export default getToolBoxString;
