<script>
  import VerticalComponentContainer from "../../components/electroblocks/VerticalComponentContainer.svelte";
  import Debug from "../../components/electroblocks/arduino/Debug.svelte";
  import Message from "../../components/electroblocks/arduino/Message.svelte";
  import selectedBoard from "../../core/blockly/selectBoard";
  import { LineBreakTransformer } from '../../core/arduino/linebreak.transformer';
  import arduionMessageStore from '../../stores/arduino-message.store';

  let isConnected = false;
  let writer;
  let reader;
  const textDecoder = new TextDecoder("UTF-8");


  async function connectArduino() {
    const port = await navigator.serial.requestPort();
    await arduionMessageStore.connect(port);
  }

  async function closePort() {
    await arduionMessageStore.closePort();
  }

  function on() {
    arduionMessageStore.sendMessage('on');
  }

  function off() {
    arduionMessageStore.sendMessage('off');
  }
</script>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>

<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    {#if isConnected}
      <Message />
    {:else}
      <div>
        <button on:click={connectArduino}>Connect Arduino</button>
        <button on:click={closePort}>Close Arduino</button>
        <button on:click={() => alert('Hello World')}>Not Block</button>
        <button on:click={on}>Test On</button>
        <button on:click={off}>Test Off</button>
        <h1>Current message {$arduionMessageStore ? $arduionMessageStore.message : 'No Message'}</h1>
      </div>
    {/if}
  </div>
  <div class="slot-wrapper" slot="bottom">
    {#if isConnected}
      <Debug />
    {/if}
  </div>
</VerticalComponentContainer>
