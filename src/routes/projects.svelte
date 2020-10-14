<script lang="ts">
import Login from '../components/auth/Login.svelte'
    import userStore from '../stores/user.store';
    
</script>

{#if !$userStore}
    <h1>Login Google</h1>
    <Login />
{/if}

{#if !$userStore}

{/if}
<pre>
    {JSON.stringify($userStore, null, 2)}
</pre>