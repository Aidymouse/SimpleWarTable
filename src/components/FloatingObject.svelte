<script>

    import { floating_object } from "../stores/floating_object";
    import { pointer } from "../stores/pointer";
    import { map } from "../stores/map";

</script>

<div id="floating-object" style={`top: ${$pointer.client_y - $map.grid_size/2}px; left: ${$pointer.client_x - $map.grid_size/2}px;`}>

    <img src="{$floating_object.obj.base64}" style="width: {$map.grid_size}px">

</div>

<style>

    div {
        pointer-events: none;
        position: fixed;
    }

    img {
        pointer-events: none;
    }

</style>

