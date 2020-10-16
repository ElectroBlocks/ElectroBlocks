<script lang="ts">
    import settingStore from '../../stores/settings.store';
    	import { fade } from 'svelte/transition';

    let settings: {
  backgroundColor: string;
  touchSkinColor: string;
  ledColor: string;
  customLedColor: boolean;
  maxTimePerMove: number;
};

    let savedMessages = [];

    settingStore.subscribe(newSettings => {
        settings = newSettings;
    })
    
    function onSaveSettings() {
        settingStore.set(settings);
        savedMessages = [1, ...savedMessages];
        setTimeout(() => {
            savedMessages.pop();
            savedMessages = savedMessages;
        }, 2000);
    }

    
</script>
<style>
    .row {
        display: block;
        margin-top: 20px;
        position: relative;
    }
    .row label {
        display: block;
        margin-bottom: 5px;
    }
    .row input, .row input {
        display: block;
        font-size: 20px;
        padding: 5px;
        width: 100%;
    }
    #use-led-color {
        width: 30px;
        height: 30px;
        margin: 0;
    }
    button {
        padding: 10px;
        border-radius: 0;
        font-size: 16px;
        border: none;
        cursor: pointer;
        outline: none;
        position: absolute;
        top: 0;
        right: -13px;
        transition: .3s linear transform;
        width: 100px;
    }
    #saved-settings {
        width: 100%;
        margin-top: 100px;
        border-radius: 4px;
        padding: 10px;
        border: solid black 1px;
    }
    button:active  {
        transform: scale(.9);
    }
</style>
{#if settings}
<div class="row">
    <label for="use-led-color">Use Led Color</label>
    <input type="checkbox"  bind:checked={settings.customLedColor} id="use-led-color">
</div>

{#if settings.customLedColor }
    <div class="row">
    <label for="led-color">Led Color</label>
    <input bind:value={settings.ledColor} id="led-color" type="color">
    </div>
{/if}

<div class="row">
    <label for="touch-skin-color">Touch sensor's finger color</label>
    <input id="touch-skin-color" bind:value={settings.touchSkinColor} type="color">
</div>

<div class="row">
    <label for="background-color">Background Color</label>
    <input id="background-color" bind:value={settings.backgroundColor} type="color">
</div>

<div class="row">
    <label for="max-time">Max time per move</label>
    <input id="max-time" bind:value={settings.maxTimePerMove} type="number">
</div>

<div class="row">
    <button on:click={onSaveSettings}>Save</button>
</div>
{/if}
{#if savedMessages.length > 0}
    <div class="row" transition:fade id="saved-settings" >
        Saved Settings
    </div>
{/if}