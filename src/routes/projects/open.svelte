<script>
import { onMount } from 'svelte';

    import Login from '../../components/auth/Login.svelte';
    import { loadProject } from "../../core/blockly/helpers/workspace.helper";
    import authStore from '../../stores/auth.store';
    import firebase from 'firebase';
    
    let projectList = [
        {
            name: 'Awesome Project 1',
            created: '2020-02-20',
            description: 'adsf asd fa  asdfads fasd fa sdfa sdf asd fas',
            id: '234234234223423'
        },
        {
            name: 'Awesome Project 2',
            created: '2020-02-20',
            description: 'adsf asd fa  asdfads fasd fa sdfa sdf asd fas',
            id: '234234234223423'
        },
        {
            name: 'Awesome Project 3',
            created: '2020-02-20',
            description: 'adsf asd fa  asdfads fasd fa sdfa sdf asd fas',
            id: '234234234223423'
        },
    ];
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

            loadProject(evt.target.result);

        };

        reader.readAsText(file);
    }

    onMount(async () => {
        const db = firebase.f
    });
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
  padding: 8px;
}

table tr:nth-child(even){background-color: #f2f2f2;}

table tr:hover {background-color: #ddd;}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
#sort {
    padding: 8px;
    border: solid black 1px;
    border-radius: 0;
    margin-bottom: 5px;
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

{#if $authStore.isLoggedIn}
    <div class="row">
        <label for="sort">Sort By</label>
        <select name="" id="sort">
            <option value="name">Name</option>
            <option value="name">Recent</option>
        </select>
    </div>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Created</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each projectList as project }
                <tr>
                    <td>{project.name}</td>
                    <td>Aug, 2020</td>
                    <td><button class="btn">Open</button></td>
                    <td><button class="btn"><i class="fa fa-trash"></i></button></td>
                </tr>
            {/each}
        </tbody>
    </table>
    {:else}
    <p>Login to see your saved projects.</p>
    <Login />
{/if}