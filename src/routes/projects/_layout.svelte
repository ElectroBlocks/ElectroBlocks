<script lang="ts">
    
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
    <select  >
    <option value="/settings">Save Project</option>
    <option value="/settings/virtualcircuit">Open Project</option>
    <option value="/settings/about">Download Project</option>
    <option value="/settings/mailinglist">Mailing List</option>
</select>
    <slot></slot>
</main>