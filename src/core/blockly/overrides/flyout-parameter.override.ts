import Blockly from "blockly";

/**
 * Construct the blocks required by the flyout for the procedure category.
 * @param {!Blockly.Workspace} workspace The workspace containing procedures.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.Procedures.flyoutCategory = (workspace) => {
  const xmlList = [];
  if (Blockly.Blocks["procedures_defnoreturn"]) {
    // <block type="procedures_defnoreturn" gap="16">
    //     <field name="NAME">do something</field>
    // </block>
    const block = Blockly.utils.xml.createElement("block");
    block.setAttribute("type", "procedures_defnoreturn");
    block.setAttribute("gap", "16");
    const nameField = Blockly.utils.xml.createElement("field");
    nameField.setAttribute("name", "NAME");
    nameField.appendChild(
      Blockly.utils.xml.createTextNode(
        Blockly.Msg["PROCEDURES_DEFNORETURN_PROCEDURE"]
      )
    );
    block.appendChild(nameField);
    xmlList.push(block);
  }

  // MORE NOW COMMENTING THIS OUT FOR DEBUG
  // HAVE NOT RAN INTO A SITUATION YET THAT REQUIRES RETURN TYPE
  // POSSIBLE VERSION 4
  // if (Blockly.Blocks['procedures_defreturn']) {
  //     // <block type="procedures_defreturn" gap="16">
  //     //     <field name="NAME">do something</field>
  //     // </block>
  //     var block = Blockly.utils.xml.createElement('block');
  //     block.setAttribute('type', 'procedures_defreturn');
  //     block.setAttribute('gap', 16);
  //     var nameField = Blockly.utils.xml.createElement('field');
  //     nameField.setAttribute('name', 'NAME');
  //     nameField.appendChild(Blockly.utils.xml.createTextNode(
  //         Blockly.Msg['PROCEDURES_DEFRETURN_PROCEDURE']));
  //     block.appendChild(nameField);
  //     xmlList.push(block);
  // }

  if (xmlList.length) {
    // Add slightly larger gap between system blocks and user calls.
    xmlList[xmlList.length - 1].setAttribute("gap", 24);
  }

  function populateProcedures(procedureList, templateName) {
    for (let i = 0; i < procedureList.length; i++) {
      const name = procedureList[i][0];
      // <block type="procedures_callnoreturn" gap="16">
      //   <mutation name="do something">
      //     <arg name="x" type="Nubmer"></arg>
      //   </mutation>
      // </block>
      const block = Blockly.utils.xml.createElement("block");
      block.setAttribute("type", templateName);
      block.setAttribute("gap", "16");
      const mutation = Blockly.utils.xml.createElement("mutation");
      mutation.setAttribute("name", name);
      block.appendChild(mutation);
      xmlList.push(block);
    }
  }

  const tuple = Blockly.Procedures.allProcedures(workspace);
  populateProcedures(tuple[0], "procedures_callnoreturn");
  return xmlList;
};
