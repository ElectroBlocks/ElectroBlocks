<script lang="ts">
    import { onMount } from 'svelte';
    import { getToolboxOptions, updateToolboxXML } from '../../core/blockly/toolbox';
    let toolboxSettings;
    onMount(() => {
        toolboxSettings = getToolboxOptions();
    })
    function updateToolbox(name) {
        // We do this manually because only want this triggered when the 
        // click happens not when things are loading.
        toolboxSettings[name] = !toolboxSettings[name];
        updateToolboxXML(toolboxSettings);
    }
</script>

<style>
    .entry {
        box-sizing: border-box;
        width: 100%;
        padding: 10px;
        border: 1px gray solid;
        font-size: 20px;
        cursor: pointer;
    }
    .entry input {
        float: right;
        width: 20px;
        height: 20px;
    }
</style>



{#if toolboxSettings}
    {#each Object.keys(toolboxSettings) as name}
        <div on:click={() => updateToolbox(name)} class="entry">
            {name} <input  type="checkbox" name={name} bind:checked={toolboxSettings[name]} />
        </div>
    {/each}
{/if}
