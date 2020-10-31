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
        margin: 5px 5%;
        overflow-y: scroll; 
        overflow-x: hidden;
        min-height: 600px;
    }
    
</style>
<h2>Settings Navigation</h2>



<main>
    <select class="form" bind:this={selectBox} on:change={navigate} >
    <option value="/settings">Virtual Circuit</option>
    <option value="/settings/myprofile">My Profile</option>
    <option value="/settings/about">About</option>
    <option value="/settings/support">Support</option>
    <option value="/settings/privacy-policy">Privacy Policy</option>
</select>
    <slot></slot>
</main>