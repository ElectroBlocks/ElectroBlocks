<script lang="ts">
    export let segment;
    import { goto } from '@sapper/app';
    import { onMount } from 'svelte';
    let selectBox;
    async function navigate(e) {
        await goto(e.target.value)
    }

    onMount(() => {
        // This is to fix the drop down box
        updateNav(segment)
    });

    function updateNav(urlPart) {
        const value = urlPart ? '/projects/' + urlPart : '/projects';
        if (selectBox) {
            selectBox.value = value;
        }
    }

    $: updateNav(segment); 
</script>

<style>
    main {
        width: 90%;
        padding: 10px;
        margin: 10px auto;
        display: block;
        font-size: 20px;

    }
    select {
        width: 100%;
        padding: 10px;
        margin: 10px auto;
        display: block;
        font-size: 20px;
    }

</style>

<main>
<h2>Project Navigation</h2>
    <select class="form" bind:this={selectBox} on:change={navigate} >
    <option value="/projects">Save</option>
    <option value="/projects/new">New</option>
    <option value="/projects/open">Open</option>
    <option value="/projects/download">Download</option>
</select>
    <slot></slot>
</main>