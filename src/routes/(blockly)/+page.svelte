<script lang="ts">
  import VerticalComponentContainer from '../../components/electroblocks/VerticalComponentContainer.svelte';
  import Simulator from '../../components/electroblocks/home/Simulator.svelte';
  import Step from '../../components/electroblocks/home/Steps.svelte';
  import codeStore from "../../../stores/code.store";
  import { MicroControllerType } from "../../../core/microcontroller/microcontroller";

  let selectedBoard = MicroControllerType.ARDUINO_UNO;

  function updateBoardType(event) {
    selectedBoard = event.target.value;
    codeStore.resetCode(selectedBoard); // Updates board type and hidden categories
  }
</script>

<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    <Simulator />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Step />
  </div>
</VerticalComponentContainer>

<select on:change={updateBoardType}>
  <option value="{MicroControllerType.ARDUINO_UNO}">Arduino Uno</option>
  <option value="{MicroControllerType.ARDUINO_MEGA}">Arduino Mega</option>
</select>

<svelte:head>
  <title>ElectroBlocks</title>
</svelte:head>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
