<script lang="ts">
  import { FormGroup, Input, Label, Button } from "@sveltestrap/sveltestrap";

  import { defaultSetting } from "../../firebase/model";
  import type { Settings } from "../../firebase/model";
  import { fbSaveSettings } from "../../firebase/db";
  import authStore from "../../stores/auth.store";
  import settingsStore from "../../stores/settings.store";
  import FlashMessage from "../../components/electroblocks/ui/FlashMessage.svelte";
  import _ from "lodash";
  import { onErrorMessage } from "../../help/alerts";
  import { MicroControllerType } from "../../core/microcontroller/microcontroller";
  import { ledColors } from "../../blocks/led/virtual-circuit";
  let uid: string;

  let settings: Settings;

  let showMessage = false;

  let previousSettings = null;

  settingsStore.subscribe((newSettings) => {
    settings = newSettings;
  });

  async function onSaveSettings() {
    await saveSettings(settings);
  }

  async function onReset() {
    await saveSettings(defaultSetting);
  }

  function changeLedColor(e) {
    settings.ledColor = e.target.getAttribute("data-color");
  }

  async function saveSettings(settings: Settings) {
    if (_.isEqual(previousSettings, settings)) {
      showMessage = true;
      console.log("blocked saved", previousSettings, settings);
      return;
    }

    if (uid) {
      try {
        await fbSaveSettings(uid, settings);
        console.log("saved settings", settings);
      } catch (e) {
        onErrorMessage("Please try again in 5 minutes.", e);
      }
    }

    settingsStore.set(settings);
    previousSettings = { ...settings };
    showMessage = true;
  }

  authStore.subscribe((auth) => {
    uid = auth.uid;
  });
</script>

{#if settings}
  <div class="row">
    <div class="col">
      <FormGroup>
        <Label for="boardType">MicroController</Label>
        <Input bind:value={settings.boardType} type="select" id="boardType">
          <option value={MicroControllerType.ARDUINO_UNO}>Arduino Uno</option>
          <option value={MicroControllerType.ARDUINO_MEGA}>Arduino Mega</option>
        </Input>
      </FormGroup>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <FormGroup>
        <Label for="max-time-per-move">Milliseconds Per Move</Label>
        <Input
          bind:value={settings.maxTimePerMove}
          type="number"
          id="max-time-per-move"
        />
      </FormGroup>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <Input
        type="switch"
        bind:checked={settings.customLedColor}
        label="Custom Led Color"
      />
    </div>
  </div>

  <div class="row">
    <div class="col">
      {#if settings.customLedColor}
        <div class="row">
          <div class="col color-container">
            {#each ledColors as color (color)}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="color {color}"
                on:click={changeLedColor}
                style="background-color: {color};"
                data-color={color}
                class:selected={settings.ledColor == color}
                id={color}
              ></div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div class="row">
    <div class="col">
      <FormGroup>
        <Label for="touch-skin-color">Touch sensor's finger color</Label>
        <Input
          bind:value={settings.touchSkinColor}
          type="color"
          id="touch-skin-color"
        />
      </FormGroup>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <FormGroup>
        <Label for="background-color">Arduino's Background Color</Label>
        <Input
          bind:value={settings.backgroundColor}
          type="color"
          id="background-color"
        />
      </FormGroup>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <Button type="button" color="success" on:click={onSaveSettings}>
        Save
      </Button>
      <Button type="button" color="warning" on:click={onReset}>Reset</Button>
    </div>
  </div>
{/if}

<FlashMessage bind:show={showMessage} message="Successfully Save." />

<svelte:head>
  <title>ElectroBlocks - Virtual Circuit</title>
</svelte:head>

<style>
  .color {
    flex: 1;
    margin: 2px;
    height: 30px;
    cursor: pointer;
  }
  .color-container {
    display: flex;
  }
  .selected {
    border: black 10px dashed;
  }
</style>
