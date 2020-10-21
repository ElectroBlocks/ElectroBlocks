<script lang="ts">
    import settingStore, { defaultSetting } from '../../stores/settings.store';
    import type { Settings } from '../../stores/settings.store';
    import FlashMessage from '../../components/electroblocks/ui/FlashMessage.svelte';
    let settings: Settings

    let showMessage = false;

    settingStore.subscribe(newSettings => {
        settings = newSettings;
    })
    
    function onSaveSettings() {
        settingStore.set(settings);
        showMessage = true;
    }

    function onReset() {
        settingStore.set(defaultSetting);
        showMessage = true;
    }
</script>
<style>
    .row {
        display: block;
        margin-top: 20px;
        position: relative;
        min-height: 30px;
    }
    .row label {
        display: block;
        margin-bottom: 5px;
    }
    .row input, .row input {
        display: block;
        font-size: 20px;
        padding: 5px;
        width: calc(100% - 20px);
    }
    .row input[type="color"] {
        padding: 0;
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
        transition: .3s linear transform;
    }
    button#save {
        top: 0;
        right: 3px;
        width: 100px;
    }
    button#reset {
        top: 0;
        right: 113px;
        width: 100px;
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
    <button id="save" on:click={onSaveSettings}>Save</button>
    <button id="reset" on:click={onReset}>Reset</button>
</div>
{/if}

<FlashMessage bind:show={showMessage} message="Successfully Saved" />


