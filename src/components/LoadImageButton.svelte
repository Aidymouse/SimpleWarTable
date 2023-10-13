<script>

    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    export let select_multiple = true;

    let files = [];

    async function upload_image() {
        
        
        
        for (const file of files) {
            let r = new FileReader();
            
            r.filename = file.name;

            console.log(file);
            
            r.onload = async (e) => {
                
                dispatch("load_image", {
                    name: r.filename,
                    base64: r.result
                });
            }

            r.readAsDataURL(file);
        }
        
    }


</script>

<button>
    {#if select_multiple}
        <input type="file" multiple bind:files={files} on:change={upload_image}>
    {:else}
        <input type="file" bind:files={files} on:change={upload_image}>
    {/if}

    <slot></slot>
</button>

<style>
    button {
        width: 100%;
        height: 100%;
        position: relative;

    }


    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

</style>