<script lang="ts">
    import Login from '../components/auth/Login.svelte'
    import userStore from '../stores/user.store';
    
</script>

<style>
    main {
                width: 90%;
        padding: 10px;
        margin: 10px auto;
        display: block;
        font-size: 20px;

    }
    .row{
        width: 100%;
        margin-top: 20px;
    }

    .row input[type="text"], .row textarea, .row label {
        width: 90%;
        display: block;
        font-size: 16px;
    }

    input[type="text"] {
        padding: 5px;
    }

    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        height: 20px;
    }
    button {
        border-radius: 0;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 20px;
        padding: 6px 12px;
        margin-left: 20px;
        font-size: 16px;
    }
    button:first-of-type {
        margin-left: 0;
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
<div class="row">
        <h1>Project Settings</h1>
    </div>
    <select  >
    <option value="/settings">Save Project</option>
    <option value="/settings/virtualcircuit">Open Project</option>
    <option value="/settings/about">Download Project</option>
    <option value="/settings/mailinglist">Mailing List</option>
</select>
    
    {#if $userStore}
        <div class="row">
            <label for="project-name">Name</label>
            <input id="project-name" type="text">
        </div>
        <div class="row">
            <label for="project-description">Description</label>
            <textarea  id="project-description" cols="30" rows="10"></textarea>
        </div>
            <div class="row">
        <button>Save</button>
    </div>
    {/if}
    <div class="row">
        <h2>Load Project From Your Computer</h2>
    </div>
    <div class="row">
        <label for="file-upload" class="custom-file-upload">
            Select Project
        </label>
        <input id="file-upload" type="file"/>
    </div>

    <div class="row">
        <h2>Download</h2>
    </div>

    <div class="row">
        <button>Project</button>
        <button><i class="fa fa-code"></i> </button>
    </div>
    {#if !$userStore}
        <h1>Login Google</h1>
        <Login />
        {:else}

    {/if}
</main>


