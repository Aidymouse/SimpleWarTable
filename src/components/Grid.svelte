<script>

    import { map } from "../stores/map";
    import { pointer } from "../stores/pointer";

    export let window_height;
    export let window_width;

</script>

{#each Array.from(Array(Math.floor(window_width / $map.grid_size)).keys()) as row}
    {#each Array.from(Array(10).keys()) as col}
    
     <div class="grid-cell" style={`width: ${$map.grid_size}px;
     height: ${$map.grid_size}px;
     position: fixed;
     top: ${(row-1)*$map.grid_size + $pointer.pan_y % $map.grid_size}px;
     left: ${(col-1)*$map.grid_size + $pointer.pan_x % $map.grid_size}px;`}></div>

    {/each}
{/each}

<style>
    .grid-cell {
        border: solid 1px white;
    }
</style>