import Blockly from "blockly";

/** Override Blockly.alert() with custom implementation. */
Blockly.alert = function (message, callback) {
  if (localStorage.getItem("no_alert")) {
    return;
  }

  alert(message);
};

/**
 * Wrapper to window.confirm() that app developers may override to
 * provide alternatives to the modal browser window.
 * @param {string} message The message to display to the user.
 * @param {!function(boolean)} callback The callback for handling user response.
 */
Blockly.confirm = function (message, callback) {
  if (localStorage.getItem("no_alert")) {
    callback(true);
    return;
  }
  callback(confirm(message));
};
