<script lang="ts">
    import { loginGoogleUser } from '../../firebase/login';
    async function googleLogin() {
        try {
            await loginGoogleUser();
        } catch(e) {
            console.log(e);
            alert('error');
        }
    }
</script>

<button on:click={googleLogin}>Login With Google</button>