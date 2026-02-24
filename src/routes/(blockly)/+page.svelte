<script lang="ts">
  import { onDestroy } from 'svelte';
  import VerticalComponentContainer from '../../components/electroblocks/VerticalComponentContainer.svelte';
  import Simulator from '../../components/electroblocks/home/Simulator.svelte';
  import Step from '../../components/electroblocks/home/Steps.svelte';
  import arduinoStore, { SimulatorMode, simulatorStore } from '../../stores/arduino.store';
  onDestroy(() => {
    // if they leave the page we want it to go back to the virtual mode.
    // So that the user can recieve arduino messages
    // In Live mode the usb is taken.
    simulatorStore.set(SimulatorMode.VIRTUAL);
    // Deleting any message that got created
    arduinoStore.clearMessages();
  })
</script>
{#if $simulatorStore == SimulatorMode.VIRTUAL }
<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    <Simulator />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Step />
  </div>
</VerticalComponentContainer>
{:else}
    <Simulator />
{/if}
<svelte:head>
  <title>ElectroBlocks</title>
</svelte:head>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
