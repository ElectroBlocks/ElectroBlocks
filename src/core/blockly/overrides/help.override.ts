import Blockly from 'blockly';
import { goto } from '@sapper/app';
/**
 * Load the block's help page in a new window.
 * @package
 */
Blockly.BlockSvg.prototype.showHelp = function() {
  var url = (typeof this.helpUrl == 'function') ? this.helpUrl() : this.helpUrl;
  if (url) {
    goto(url);
    alert("here here");
  }
};