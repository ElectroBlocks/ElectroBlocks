<script lang="ts">
    import { logout } from "../../firebase/auth";
    import Login from '../../components/auth/Login.svelte';
    import authStore from '../../stores/auth.store';
    async function onLogout() {
       await logout();
    }
</script>

{#if $authStore.isLoggedIn}

<div class="row">
    <label for="username">User Name</label>
    <input type="text"  id="username" />
</div>
<div class="row">
    <button>Save</button>
</div>

<hr>
    <p>To logout click the logout button.</p>
    <button on:click={onLogout} >Logout</button>
    {:else}
    <p>To access my profile you must login.</p>
    <Login />
{/if}