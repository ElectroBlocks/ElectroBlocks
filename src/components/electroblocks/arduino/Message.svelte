<script>
  import arduionMessageStore from "../../../stores/arduino-message.store";
  import codeStore from "../../../stores/code.store";
  import arduinoStore, { PortState } from "../../../stores/arduino.store";
  import { upload } from "../../../core/arduino/upload";
  import selectedBoard from "../../../core/blockly/selectBoard";
  import { WindowType, resizeStore } from "../../../stores/resize.store";
  import Arduino from "../../../routes/electroblocks/arduino.svelte";

  // List of messages
  let messages = [];

  // This is the arduion status where it's open close etc
  let arduinoStatus = PortState.CLOSE;

  // This is the value in the input text used to send messages to the Arduino
  let messageToSend = "";

  // This is the variable storing the arduino code
  let code;

  $: uploadingClass =
    arduinoStatus === PortState.UPLOADING
      ? "fa-spinner fa-spin fa-6x fa-fw"
      : "fa-upload";

  codeStore.subscribe((newCode) => {
    code = newCode;
  });

  arduinoStore.subscribe((status) => {
    arduinoStatus = status;
  });

  arduionMessageStore.subscribe((newMessage) => {
    if (newMessage) {
      messages = [...messages, newMessage];
    }
  });

  async function connectOrDisconnectArduino() {
    if (arduinoStatus == PortState.OPEN) {
      arduinoStatus = PortState.CLOSING;
      try {
        await arduionMessageStore.closePort();
      } catch (e) {
        console.error("close port error", e);
        alert(
          "Please report that there was an error closing the port " + e.message
        );
      }

      arduinoStatus = PortState.CLOSE;
      return;
    }
    try {
      arduinoStatus = PortState.OPENNING;
      const requestOptions = {
        // Filter on devices with the Arduino USB vendor ID.
        filters: [{ usbVendorId: 0x2341, usbProductId: 0x0043 }],
      };
      const port = await navigator.serial.requestPort(requestOptions);
      arduionMessageStore.connect(port).then();
      arduinoStatus = PortState.OPEN;
    } catch (error) {
      console.error(error, "error");
      console.log("connectArduino error");
      arduinoStatus = PortState.CLOSE;
    }
  }

  async function closePort() {
    arduinoStatus = PortState.CLOSING;
    try {
      await arduionMessageStore.closePort();
    } catch (e) {
      console.error(e);
      console.log("closePort error");
    }

    arduinoStatus = PortState.CLOSE;
  }

  function sendMessage() {
    if (arduinoStatus !== PortState.OPEN) {
      return;
    }
    try {
      arduionMessageStore.sendMessage(messageToSend);
      messageToSend = "";
    } catch (e) {
      console.log(e, "sendMessage error");
    }
  }

  async function uploadCode() {
    if (arduinoStatus !== PortState.CLOSE) {
      return;
    }
    arduinoStatus = PortState.UPLOADING;
    try {
      const avrgirl = new AvrgirlArduino({
        board: selectedBoard().type,
        debug: true,
      });
      await upload(code, avrgirl);
    } catch (e) {
      console.error(e, "error message");
      alert(
        "There was an error uploading your code.  Please check console for error messages."
      );
    }
    arduinoStatus = PortState.CLOSE;
  }
  function clearMessages() {
    messages = [];
  }
</script>

<style>
  #messages {
    padding: 10px;
    font-size: 18px;
    overflow: scroll;
    height: calc(100% - 80px);
  }
  #messages p img {
    vertical-align: middle;
  }
  #send-message-container {
    display: flex;
    justify-content: space-between;
    width: 98%;
    margin: auto;
    height: 50px;
  }
  #send-message-container form {
    flex: 4;
  }
  #send-message-container input {
    width: 98%;
    margin: 5px;
    outline: none;
    border: none;
    font-size: 25px;
    height: 40px;
    border-bottom: 1px solid #505bda;
    transition: linear 1s border-bottom;
  }
  #send-message-container input:active,
  #send-message-container input:focus {
    outline: none;
    border-bottom: 2px solid #505bda;
  }
  #send-message-container input:read-only {
    cursor: not-allowed;
    color: #fff;
  }
  button {
    margin: 5px;
    border: none;
    border-radius: 2px;
    font-size: 20px;
    padding: 0 10px;
    width: 50px;
    height: 40px;
    margin-top: 10px;
    cursor: pointer;
  }
  button i {
    transition: ease-in-out 0.4s font-size;
  }
  button:focus,
  button:active {
    outline: none;
  }
  button:active i {
    font-size: 18px;
  }
  button:disabled {
    cursor: not-allowed;
    background-color: rgb(251, 251, 247);
  }
  button:disabled i {
    font-size: 20px;
  }
  .fa-eject {
    color: #eb423c;
  }
  .fa-usb {
    color: #b063c5;
  }
  button:not(:disabled) .fa-paper-plane {
    color: #16bb3a;
  }
  .fa-trash {
    color: #16bb3a;
  }
</style>

<section id="messages">
  {#each messages as mes (mes.id)}
    <article class="message-computer">
      <p>
        <img
          src={mes.type === 'Computer' ? './laptop.png' : './cpu.png'}
          alt={mes.type === 'Computer' ? 'computer' : 'arduino'} />
        {mes.message}
      </p>
    </article>
  {/each}
</section>
<section id="send-message-container">
  <form on:submit|preventDefault={sendMessage}>
    <input
      readonly={!(arduinoStatus === PortState.OPEN)}
      type="text"
      bind:value={messageToSend}
      placeholder="Send a message to Arduino" />
  </form>
  <button disabled={!(arduinoStatus === PortState.OPEN)} on:click={sendMessage}>
    <i class="fa fa-paper-plane" />
  </button>
  <button on:click={connectOrDisconnectArduino}>
    <i
      class="fa"
      class:fa-eject={arduinoStatus === PortState.OPEN}
      class:fa-usb={arduinoStatus === PortState.CLOSE} />
  </button>

  <button disabled={!(arduinoStatus === PortState.CLOSE)} on:click={uploadCode}>
    <i class="fa {uploadingClass}" />
  </button>
  <button on:click={clearMessages}>
    <i class="fa fa fa-trash" />
  </button>
</section>
