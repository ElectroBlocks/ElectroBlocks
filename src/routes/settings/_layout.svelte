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
        const value = segment ? '/settings/' + segment : '/settings';
        selectBox.value = value;
    }) 

</script>
<style>
    h2 {
        margin: 10px 5%;
    }
    main {
        margin: 20px 5%;
    }
    select {
        width: 90%;
        padding: 10px;
        margin: 10px auto;
        display: block;
        font-size: 20px;
    }
</style>
<h2>Settings Navigation</h2>

<select bind:this={selectBox} on:change={navigate} >
    <option value="/settings">ToolBox</option>
    <option value="/settings/virtualcircuit">Virtual Circuit Settings</option>
    <option value="/settings/about">About</option>
    <option value="/settings/mailinglist">Mailing List</option>
    <option value="/settings/bug">Report Bugs</option>
    <option value="/settings/myprofile">My Profile</option>
    <option value="/settings/privacy-policy">Privacy Policy</option>
</select>

<main style="overflow-y: scroll;">
    <slot></slot>
</main>