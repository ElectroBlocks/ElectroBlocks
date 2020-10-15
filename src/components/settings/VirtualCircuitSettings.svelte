<script>
    let backgroundColor = '#d9e4ec';
    let touchSkinColor = '#a424d3';
    let ledColor = '#AA0000';
    let customLedColor = false;
    let maxTimePerMove = 1000;

    function onSaveSettings() {
        localStorage.setItem('virtual-circuit', JSON.stringify({
            backgroundColor,
            touchSkinColor,
            ledColor,
            customLedColor,
            maxTimePerMove
        }))
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
    }
</style>
<div class="row">
    <label for="use-led-color">Use Led Color</label>
    <input type="checkbox"  bind:checked={customLedColor} id="use-led-color">
</div>

{#if customLedColor }
    <div class="row">
    <label for="led-color">Led Color</label>
    <input bind:value={ledColor} id="led-color" type="color">
    </div>
{/if}

<div class="row">
    <label for="touch-skin-color">Touch sensor's finger color</label>
    <input id="touch-skin-color" bind:value={touchSkinColor} type="color">
</div>

<div class="row">
    <label for="background-color">Background Color</label>
    <input id="background-color" bind:value={backgroundColor} type="color">
</div>

<div class="row">
    <label for="max-time">Max time per move</label>
    <input id="max-time" bind:value={maxTimePerMove} type="number">
</div>

<div class="row">
    <button on:click={onSaveSettings}>Save Settings</button>
</div>
