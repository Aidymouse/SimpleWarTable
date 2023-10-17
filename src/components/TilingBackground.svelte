<script>
    import { afterUpdate, onMount } from "svelte";

    import * as PIXI from 'pixi.js';
    import { pointer } from "../stores/pointer";




    export let image; 

    export let window_width;
    export let window_height;

    export let background_container;

    let bg_texture;

    let rows;
    let columns;

    function resize() {

    }

    onMount(async () => {

        bg_texture = await PIXI.Assets.load(image);

        rows = Math.ceil(window_height/bg_texture.height) + 2;
        columns = Math.ceil(window_width/bg_texture.width) + 2;


    })

    let bg_sprites = {};

    afterUpdate(() => {
        for (let row=0; row<rows; row++) {
            for (let col=0; col<columns; col++) {

                let sprite_id = `${row}:${col}`
                if (bg_sprites[sprite_id] == null) {
                    bg_sprites[sprite_id] = new PIXI.Sprite(bg_texture);
                    background_container.addChild(bg_sprites[sprite_id]);
                }

                let s = bg_sprites[sprite_id];
                // TODO: Pretty sure there's a better way to do this with modulusing the 
                s.x = (col * bg_texture.width + $pointer.pan_x) % (window_width+bg_texture.width*2) - bg_texture.width;
                if ($pointer.pan_x < 0 && s.x + bg_texture.width < 0) s.x += window_width+bg_texture.width;
                
                s.y = (row * bg_texture.height + $pointer.pan_y) % (window_height+bg_texture.height*2) - bg_texture.height;
                if ($pointer.pan_y < 0 && s.y + bg_texture.height < 0) s.y += window_height+bg_texture.height;

            }
        }

    })

</script>