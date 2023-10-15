<script>
  import { afterUpdate, onMount } from "svelte";

  import FigureLayer from "./components/Battlefield.svelte";
  import Trays from "./components/Trays.svelte";
  import Grid from "./components/Grid.svelte";
  import FloatingObject from "./components/FloatingObject.svelte";

  import { pointer } from "./stores/pointer";
  import { floating_object } from "./stores/floating_object";

  import * as PIXI from 'pixi.js';
  import PointerEvents from "./components/PointerEvents.svelte";
  import KeyEvents from "./components/KeyEvents.svelte";

  let app = new PIXI.Application({
    resizeTo: window,
    backgroundAlpha: 0
  });

  let global_container = new PIXI.Container();
  
  let object_container = new PIXI.Container();
  global_container.addChild(object_container);
  
  let ui_graphics = new PIXI.Graphics();
  global_container.addChild(ui_graphics);

  let figure_layer;

  app.stage.addChild(global_container);

  onMount(() => {
      document.getElementById("main-canvas").appendChild(app.view);
  })

  afterUpdate(() => {
    global_container.x = $pointer.pan_x;
    global_container.y = $pointer.pan_y;
  })

</script>

<main>

  
  <div id="main-canvas" on:pointerleave={() => {console.log("Okay")}}>
    
    <FigureLayer bind:this={figure_layer} bind:app bind:object_container bind:ui_graphics />
    
  </div>
  
  <Trays />
  
  <PointerEvents bind:figure_layer />
  <KeyEvents />
  
  {#if $floating_object.obj}
    <FloatingObject />
  {/if}

</main>

<style>

  main {
    width: 100%;
    height: 100%;

    background-image: url("assets/green felt.jpg");
  }

  #main-canvas {
    width: 100%;
    height: 100%;
  }

</style>
