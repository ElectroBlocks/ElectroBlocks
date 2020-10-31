<script lang="ts" >
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '@sapper/app';

    import Login from '../components/auth/Login.svelte';
    import { loadProject } from "../core/blockly/helpers/workspace.helper";
    import authStore from '../stores/auth.store';
    import firebase from 'firebase';
    import { getFile, getProject } from '../firebase/db';
    import type { Project } from '../firebase/model';

    const unSubList: Function[] = [];
    let projectList: [Project, string][] = [];
    
    function changeProject(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (!confirm(`Do you want to load ${file.name}, this will erase everything that you have done.`)) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function(evt) {
            if(evt.target.readyState != 2) return;
            if(evt.target.error) {
                alert('Error while reading file');
                return;
            }

            loadProject(evt.target.result as string);

        };

        reader.readAsText(file);
    }

    onMount(async () => {
       const unSubAuth = authStore.subscribe(async auth => {
            if (auth.isLoggedIn) {
                await updateProjectList();
                return;
            } 
            projectList = [];
        });
        unSubList.push(unSubAuth)
    });

    async function updateProjectList() {
        try {
            const db = firebase.firestore();
            const projectCollection =  db.collection('projects');
            const querySnapshot = await projectCollection.where('userId', '==', $authStore.uid).get();
            projectList = [];
            querySnapshot.forEach(doc => {
                projectList.push([doc.data(), doc.id]);
            });
            projectList = [...projectList];

        } catch(e) {
            console.log(e, 'error');
        }

    }

    onDestroy(() => {
        unSubList.forEach(s => s());
    });

    function formatDate(timestamp: firebase.firestore.Timestamp | Date) {
        if (timestamp instanceof Date) {
            return timestamp.toDateString();
        }

        const date = new Date(timestamp.seconds * 1000);

        return date.toDateString();
    }

    async function openProject(projectId) {
        await goto(`/project/${projectId}`);
    }
</script>
<style>
    main {
        width: 90%;
        margin: 10px auto;
    }
    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
    

    table {
        border-collapse: collapse;
        margin: 25px 0;
        font-size: 0.9em;
        width: 100%;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    table thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: left;
    }

    table th,
    table td {
        padding: 12px 15px;
    }

    .btn {
        display: block;
        margin: auto;
    }
</style>
<main>
    <h2>Your Projects</h2>
    {#if $authStore.isLoggedIn }
        <label class="form" for="search">Search</label>
        <input type="text" id="search" class="form" />
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Modified</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each projectList as project }
                    <tr>
                        <td>{project[0].name}</td>
                        <td>{formatDate((project[0].updated))}</td>
                        <td><button class="form" on:click={() => openProject(project[1])} >Open</button> </td>
                        <td><button class="btn"><i class="fa fa-trash"></i></button></td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <h3>Load project from your computer</h3>
        <label for="file-upload" class="form custom-file-upload">
            <i class="fa fa-cloud-upload"></i> Choose Project
        </label>
        <input on:change={changeProject} id="file-upload" type="file"/>

        {:else}
        <p>Login to see your saved projects.</p>
        <Login />
    {/if}

</main>
