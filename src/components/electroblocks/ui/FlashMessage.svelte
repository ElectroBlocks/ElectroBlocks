<script lang="ts">
    import { fade } from 'svelte/transition';
    export let message: string;
    export let delay = 2000;
    export let show = false;
    let showMessageQueue = [];

    function addSaveMessage() {
        showMessageQueue = [1, ...showMessageQueue];
        setTimeout(() => {
            showMessageQueue.pop();
            showMessageQueue = showMessageQueue;
        }, delay);
    }
    
    $: if (show) {
        addSaveMessage();
        show = false;
    }

</script>

<style>
    #message {
        width: 75%;
        display: block;
        margin: 20px auto;
        border-radius: 4px;
        padding: 10px;
        text-align: center;
        border: solid black 1px;
    }
</style>

{#if showMessageQueue.length > 0}
    <div class="row" transition:fade id="message" >
        {message}
    </div>
{/if}