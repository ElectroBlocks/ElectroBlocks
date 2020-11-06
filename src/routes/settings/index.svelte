<script lang="ts">
    import { defaultSetting } from '../../firebase/model';
    import type { Settings } from '../../firebase/model';
    import { fbSaveSettings } from '../../firebase/db';
    import authStore from '../../stores/auth.store';
    import settingsStore from '../../stores/settings.store';
    import FlashMessage from '../../components/electroblocks/ui/FlashMessage.svelte';
    import _ from 'lodash';
import { onErrorMessage } from '../../help/alerts';
    let uid: string;

    let settings: Settings

    let showMessage = false;

    let previousSettings = null;

    settingsStore.subscribe(newSettings => {
        settings = newSettings;
    })
    
    async function onSaveSettings() {
        await saveSettings(settings)
    }

    async function onReset() {
        await saveSettings(defaultSetting)
    }

    async function saveSettings(settings: Settings) {

        if (_.isEqual(previousSettings, settings)) {
            showMessage = true;
            console.log('blocked saved', previousSettings, settings);
            return;
        }
        
        if (uid) {
            try {
                await fbSaveSettings(uid, settings);
                console.log('saved settings', settings);
            } catch(e) {
                onErrorMessage("Please try again in 5 minutes.", e);
            }
        }
        
        settingsStore.set(settings);
        previousSettings = { ...settings};
        showMessage = true;

    }

    authStore.subscribe(auth => {
        uid = auth.uid;
    })
</script>
<style>    
    .btn-container {
        height: 40px;
    }
    input.form[type="color"] {
        padding-bottom: 1px!important;
        padding-top: 1px !important;
    }
    
</style>
{#if settings}
    <label class="form" for="use-led-color">Use Led Color</label>
    <input class="form"   type="checkbox"  bind:checked={settings.customLedColor} />
    <br />
{#if settings.customLedColor }
    <label class="form"  for="led-color">Led Color</label>
    <input class="form"  bind:value={settings.ledColor} id="led-color" type="color">
{/if}

    <label class="form"  for="touch-skin-color">Touch sensor's finger color</label>
    <input class="form"  id="touch-skin-color" bind:value={settings.touchSkinColor} type="color">

    <label class="form"  for="background-color">Background Color</label>
    <input class="form"  id="background-color" bind:value={settings.backgroundColor} type="color">

    <label class="form"  for="max-time">Max time per move</label>
    <input class="form"  id="max-time" bind:value={settings.maxTimePerMove} type="number">
    <div class="btn-container">
        <button class="form success"  id="save" on:click={onSaveSettings}  >Save</button>
        <button class="form" id="reset" on:click={onReset} >Reset</button>
    </div>
{/if}


<FlashMessage bind:show={showMessage} message="Successfully Save." />


<svelte:head>
  <title>Electroblocks - Virtual Circuit</title>
</svelte:head>