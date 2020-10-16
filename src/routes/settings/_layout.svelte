<script lang="ts"> 
    import { goto } from '@sapper/app';

    async function navigate(e) {
        await goto(e.target.value)
    }

</script>
<style>
    h1 {
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
<h1>Settings</h1>

<select on:change={navigate} >
    <option value="/settings">ToolBox</option>
    <option value="/settings/virtualcircuit">Virtual Circuit Settings</option>
    <option value="/settings/about">About</option>
    <option value="/settings/mailinglist">Mailing List</option>
    <option value="/settings/bug">Report Bugs</option>
    <option value="/settings/user">User Settings</option>
    <option value="/settings/credits">Credits</option>
</select>

<main>
    <slot></slot>
</main>