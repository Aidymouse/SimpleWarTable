<script>
  import FigureTray from "./trays/FigureTray.svelte";


    let buttons = [
        "Figures",
        "Terrain",
        "Templates",
    ]

    let active_tray = null;

    function button_clicked(button) {
        if (active_tray == button) {
            active_tray = null
        } else {
            active_tray = button;
        }
    }

</script>

<main class:extended={active_tray != null}>

    <div id="container">
        
        <div id="buttons">
        
            {#each buttons as b}
                <div class="button" class:active-button={active_tray == b} on:click={() => { button_clicked(b) }}>
                    {b}
                </div>
            {/each}

        </div>

        <div id="tray">

            {#if active_tray == "Figures"}
                <FigureTray />
            {/if}

        </div>

    </div>

    


</main>

<style>

    main {
        position: absolute;
        right: 0;
        top: 0;

        height: 100%;
        width: calc(5em + 2 * var(--gap-mid));
        padding: var(--gap-mid);
        box-sizing: border-box;
        transition: ease 0.1s;
    }

    #container {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        overflow: hidden;
    }

    .extended {
        width: calc(5em + 15em + 2 * var(--gap-mid));
        transition: ease 0.1s;
    }

    #tray {
        min-width: 15em;
        height: 100%;
        background-color: var(--bg-primary);
        padding: var(--gap-mid);
        box-sizing: border-box;
        overflow: scroll;
        
    }

    #buttons {
        min-width: 5em;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;

        
    }
    
    .button {
        width: 100%;
        aspect-ratio: 1/1.2;
        background-color: var(--bg-primary);
        transition-duration: 0.2s;
        padding: var(--gap-small);
        box-sizing: border-box;

        font-size: var(--text-small);
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    .button:hover {
        background-color: var(--bg-mid);
        transition-duration: 0.2s;
    }

    .active-button {
        background-color: var(--bg-mid);
    }

    .active-button:hover {
        background-color: var(--bg-light);
    }

</style>