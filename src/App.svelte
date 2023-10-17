<script>
  import { afterUpdate, onMount } from "svelte";

  import FigureLayer from "./components/Battlefield.svelte";
  import Trays from "./components/Trays.svelte";
  import Grid from "./components/Grid.svelte";
  import FloatingObject from "./components/FloatingObject.svelte";
  import TilingBackground from "./components/TilingBackground.svelte";

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


  let background_container = new PIXI.Container();
  global_container.addChild(background_container);

  
  let offset_container = new PIXI.Container();
  global_container.addChild(offset_container);

  let object_container = new PIXI.Container();
  offset_container.addChild(object_container);
  
  let ui_container = new PIXI.Container();
  global_container.addChild(ui_container);

  let ui_graphics = new PIXI.Graphics();
  ui_container.addChild(ui_graphics);

  let figure_layer;

  let window_width, window_height;

  app.stage.addChild(global_container);

  onMount(() => {
      document.getElementById("main-canvas").appendChild(app.view);
  })

  

  afterUpdate(() => {
    offset_container.x = $pointer.pan_x;
    offset_container.y = $pointer.pan_y;
  })

</script>

<svelte:window bind:outerWidth={window_width} bind:outerHeight={window_height} />

<main>

  
  <div id="main-canvas">
  
    <TilingBackground image={"src/assets/green_felt_stolen.jpg"} bind:window_width bind:window_height bind:background_container />

    <FigureLayer bind:this={figure_layer} bind:app bind:object_container bind:ui_graphics bind:ui_container />
    
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

  }

  #main-canvas {
    width: 100%;
    height: 100%;
  }

</style>
