<script lang="ts">
    import userStore from '../../stores/user.store';
</script>

<style>
    .row{
        width: 100%;
        margin-top: 20px;
    }
    .row * {
        box-sizing: border-box;
    }

    .row input[type="text"], .row textarea, .row label {
        width: 100%;
        display: block;
        font-size: 16px;
    }

    .row input[type="text"] {
        padding: 5px 0px 5px 5px;
    }

    button {
        border-radius: 0;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 20px;
        padding: 6px 12px;
        font-size: 16px;
        float: right;
    }
</style>

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