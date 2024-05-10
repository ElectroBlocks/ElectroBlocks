import Blockly, { type WorkspaceSvg } from "blockly";

export const overrideTrashBlocks = (workspace) => {
  workspace.trashcan.flyout_.workspace_.addChangeListener(function (event) {
    const workspace = Blockly.Workspace.getById(
      event.workspaceId
    ) as WorkspaceSvg;
    const trashCan: any = (Blockly.getMainWorkspace() as WorkspaceSvg).trashcan;

    // This handles removing items from the trash can
    // after they have been used
    if (event.type === Blockly.Events.UI) {
      // Deletes them once they have been used
      const block = workspace.getBlockById(event.newValue);
      const xml = Blockly.Xml.blockToDom(block);
      const cleanedXML = trashCan.cleanBlockXML_(xml);
      for (let i = 0; i < trashCan.contents_.length; i += 1) {
        const removeDisableStringFromBlock = trashCan.contents_[i].replace(
          / disabled="true"/g,
          ""
        );
        if (cleanedXML === removeDisableStringFromBlock) {
          delete trashCan.contents_[i];
        }
      }

      // Re index item strings in the trash can
      let counter = 0;
      const contentsOfTrashCan = trashCan.contents_;
      const reIndexContents = [];
      contentsOfTrashCan.forEach(function (content) {
        reIndexContents[counter] = content;
        counter += 1;
      });
      trashCan.contents_ = reIndexContents;
      return;
    }

    // Makes sure all the blocks in the trash can are enabled.
    const allBlocks = workspace.getAllBlocks(true);
    allBlocks.forEach(function (block) {
      if (block.type === "arduino_start") {
        block.dispose(true);
      } else {
        block.setEnabled(true);
      }
    });
  });
};
