<script lang="ts" >
import { onMount, onDestroy } from 'svelte';

    import Login from '../../components/auth/Login.svelte';
    import { loadProject } from "../../core/blockly/helpers/workspace.helper";
    import authStore from '../../stores/auth.store';
    import firebase from 'firebase';
    import type { Project } from '../../firebase/model';
    import { getFile } from '../../firebase/db';

    const unSubList: Function[] = [];
    
    let projectList: Project[] = [];
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
                const db = firebase.firestore();
                const projectCollection =  db.collection('projects');
                const projectRef = await projectCollection.doc(auth.uid).get();
                if (projectRef.exists) {
                    projectList = projectRef.data().projects;
                }
            }
        });
        unSubList.push(unSubAuth)
    });

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

    async function openProject(id) {
        try {
            const project = projectList.find(p => p.id === id);
            loadProject(await getFile(project, $authStore.uid));
        } catch(e) {
            alert('error');
        }   
    }
</script>
<style>
    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
    div.row label {
        width: fit-content;
    }

    table {
    border-collapse: collapse;
    width: 100%;
    }

    table td, table th {
    border: 1px solid #ddd;
    padding: 2px;
    text-align: center;
    }

    table tr:nth-child(even){background-color: #f2f2f2;}

    table tr:hover {background-color: #ddd;}

    table th {
    background-color: #512c62;
    color: white;
    }
    .row {
        margin-bottom: 10px;
    }
    .btn {
        display: block;
        margin: auto;
    }
</style>

<div class="row">
    <h3>Load project from your computer</h3>
</div>
<div class="row">
<label for="file-upload" class="custom-file-upload">
    <i class="fa fa-cloud-upload"></i> Choose Project
</label>
<input on:change={changeProject} id="file-upload" type="file"/>
</div>

{#if $authStore.isLoggedIn }
    <div class="row">
        <label for="search">Search</label>
        <input type="text" id="searc" />
    </div>
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
                    <td>{project.name}</td>
                    <td>{formatDate((project.updated))}</td>
                    <td><button on:click={() => openProject(project.id)} class="btn">Open</button> </td>
                    <td><button class="btn"><i class="fa fa-trash"></i></button></td>
                </tr>
            {/each}
        </tbody>
    </table>
    {:else}
    <p>Login to see your saved projects.</p>
    <Login />
{/if}