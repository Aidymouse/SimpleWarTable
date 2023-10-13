<script>
    import LoadImageButton from "../LoadImageButton.svelte";

    import { db } from '../../lib/db'; 
    
    import { liveQuery } from "dexie";

    import { createEventDispatcher } from "svelte";

    import { floating_object } from "../../stores/floating_object";

    const dispatch = createEventDispatcher();

    async function add_new_figure(e) {
        console.log(e);

        const id = await db.figures.add({
            label: e.detail.name,
            base64: e.detail.base64
        })
    }

    async function remove_figure(id) {
        db.figures.delete(id);
    }


    function figure_pointerdown(e, fgr) {
        $floating_object.obj = JSON.parse(JSON.stringify(fgr));
        /*
        dispatch("grab_figure", {
            figure: fgr
        });*/
    }

    function figure_pointerup(e) {

    }

    function figure_dragstart(e, figure) {

        e.dataTransfer.setData("obj", JSON.stringify(figure));

    }

    let figures = liveQuery(
        () => db.figures.toArray()
    );

</script>

<main>

    {#if $figures}
        <div class="figure">
            <div class="figure-square">
                <LoadImageButton on:load_image={add_new_figure}>+</LoadImageButton>
            </div>
        
            <p>Load Image</p>

        </div>
    
        {#each $figures as figure (figure.id)}
            <div class="figure" on:pointerdown={(e) => {figure_pointerdown(e, figure)}} draggable={false}>
                <div class="figure-square">
                    <img src={figure.base64} draggable={false}>
                </div>
                <p draggable={false}>{figure.label}</p>
            </div>
        {/each}
    {/if}

</main>

<style>
    
    main {
        width: 100%;
        height: fit-content;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--gap-mid);
        overflow: hidden;
    }

    .figure {
        width: 100%;
        aspect-ratio: 1/1.4;
        font-size: var(--text-small);

        position: relative;

        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: 1fr;

        overflow: hidden;
    }

    .figure:hover {
        background-color: var(--bg-mid);
    }

    .figure-square {
        width: inherit;
        aspect-ratio: 1/1;
        overflow: hidden;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .figure-square img {
        max-width: 100%;
        max-height: 100%;
    }

    .figure p {
        margin: 0;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;

    }

</style>