<script lang="ts">
  import VerticalComponentContainer from '../components/electroblocks/VerticalComponentContainer.svelte';
  import Simulator from '../components/electroblocks/home/Simulator.svelte';
  import Step from '../components/electroblocks/home/Steps.svelte';
</script>

<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    <Simulator />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Step />
  </div>
</VerticalComponentContainer>
<svelte:head>
  <title>ElectroBlocks</title>
</svelte:head>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
