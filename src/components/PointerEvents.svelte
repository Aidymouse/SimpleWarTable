<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { pointer } from "../stores/pointer";
    import { floating_object } from "../stores/floating_object";

    const dispatch = createEventDispatcher();

    export let figure_layer;

    onMount(() => {
        document.onpointermove = pointermove;
        document.onpointerdown = pointerdown;
        document.onpointerup = pointerup;
        document.onpointerleave = pointerleave;
        document.onblur = blur;
    });

    function pointermove(e) {

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

        figure_layer.pointermove(e);

    }
    
    function pointerdown(e) {
        
        if (e.button == 1) {
            e.preventDefault();
            $pointer.panning = true;
        }

        figure_layer.pointerdown(e);
    
    }


    function pointerup(e) {
        if (e.button == 1) { // Middle mouse button
            e.preventDefault();
            $pointer.panning = false;
        }

        figure_layer.pointerup(e);

        $floating_object.obj = null;
    }

    function pointerleave(e) {
        $pointer.panning = false;
    }

    function blur(e) {
        $pointer.panning = false;
    }

</script>