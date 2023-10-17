<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { pointer } from "../stores/pointer";
    import { floating_object } from "../stores/floating_object";

    const dispatch = createEventDispatcher();

    export let figure_layer;

    onMount(() => {
        document.getElementById("main-canvas").onpointermove = canvas_pointermove;
        document.getElementById("main-canvas").onpointerdown = canvas_pointerdown;
        document.getElementById("main-canvas").onpointerup = canvas_pointerup;
        document.getElementById("main-canvas").onpointerleave = canvas_pointerleave;
        document.getElementById("main-canvas").oncontextmenu = canvas_contextmenu;
        
        document.onpointerdown = document_pointerdown
        document.onpointerup = document_pointerup
        document.onpointermove = document_pointermove;
        document.onpointerleave = document_pointerleave
        document.onblur = document_blur;
    });


    function document_pointerleave(e) {
        
        $pointer.panning = false;

    }

    function document_blur(e) {
        $pointer.panning = false;
    }

    function document_pointermove(e) {
        $pointer.client_x = e.clientX;
        $pointer.client_y = e.clientY;

        $pointer.delta_x = $pointer.client_x - $pointer.last_client_x;
        $pointer.delta_y = $pointer.client_y - $pointer.last_client_y;

        $pointer.last_client_x = $pointer.client_x;
        $pointer.last_client_y = $pointer.client_y;

        if ($pointer.panning) {
            $pointer.pan_x += $pointer.delta_x;
            $pointer.pan_y += $pointer.delta_y;
        }

        $pointer.world_x = $pointer.client_x - $pointer.pan_x;
        $pointer.world_y = $pointer.client_y - $pointer.pan_y;
    }

    function document_pointerdown(e) {

        if (e.button == 1) {
            e.preventDefault();
            $pointer.panning = true;
        }

    }

    function document_pointerup(e) {
        if (e.button == 1) { // Middle mouse button
            e.preventDefault();
            $pointer.panning = false;
        }
        $floating_object.obj = null;
    }



    // Canvas
    function canvas_pointermove(e) {


        figure_layer.pointermove(e);

    }
    
    function canvas_pointerdown(e) {
        

        figure_layer.pointerdown(e);
    
    }


    function canvas_pointerup(e) {
        

        figure_layer.pointerup(e);

    }

    function canvas_pointerleave(e) {

        figure_layer.pointerleave(e)
    }

    function canvas_contextmenu(e) {
        if (!figure_layer.contextmenu(e)) return false;
    }

    
</script>