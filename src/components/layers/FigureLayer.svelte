<script>

    import { afterUpdate, onMount, tick } from "svelte";

    import { pointer } from "../../stores/pointer";
    import { floating_object } from "../../stores/floating_object";
    import { map } from "../../stores/map";
    import { keys } from "../../stores/keys";

    import * as PIXI from 'pixi.js';

    export let app;
    export let object_container;
    export let ui_graphics;

    let figures = [];

    let id = 1;

    let sprite_container = new PIXI.Container();
    let ui_selection = new PIXI.Graphics();

    let selected_figures = {};

    let grabbed_selection = false;
    let hovering_selection = false;

    let making_selection = false;
    let selection_box = { x: -1, y: -1, w: 0, h: 0 }

    let creating_selection = false;
    
    let prospective_selected_figures = {};

    let update = false;

    export function new_figure(figure) {
        figure.id = id;
        figures.push(figure);
        id++;
        update = !update;
    }
    
    function figure_pointerenter (e, fgr, spr) {
        prospective_selected_figures[fgr.id] = fgr;
        update = !update;
    }
    
    function figure_pointerout (e, fgr, spr) {
        delete prospective_selected_figures[fgr.id];
        update = !update;
    }
    
    function figure_pointerdown (e, fgr, spr) {
        if (e.button != 0) return;
        
        // If shift not held...
        
        // Not currently selected
        if (selected_figures[fgr.id] == null) {
            
            if (!$keys.down["Shift"]) {
                selected_figures = {};
            }
            
            selected_figures[fgr.id] = fgr;
            
            
        } else {
            if ($keys.down["Shift"]) {
                delete selected_figures[fgr.id];
                return;
            }

        }

        grabbed_selection = true;

        update = !update;
    }
    
    function figure_pointerup(e, fgr, spr) {
        
        grabbed_selection = false;
        
        update = !update;
    }
    
    export function pointerdown(e) {
        
        if (Object.keys(prospective_selected_figures).length == 0) {
            selected_figures = {};
            
            making_selection = true;
            selection_box.x = $pointer.world_x;
            selection_box.y = $pointer.world_y;

            update = !update;
        }
        
    }

    export function pointermove(e) {
        if (grabbed_selection) {
            Object.keys(selected_figures).forEach(f_id => {
                selected_figures[f_id].x += $pointer.delta_x;
                selected_figures[f_id].y += $pointer.delta_y;
            })
            update = !update;
        
        } else if (making_selection) {

            selection_box.width = $pointer.world_x - selection_box.x;
            selection_box.height = $pointer.world_y - selection_box.y;


        }


    }
    
    export function pointerup(e) {
        
        if ($floating_object.obj) {
            $floating_object.obj.x = $pointer.client_x - $pointer.pan_x - $map.grid_size/2;
            $floating_object.obj.y = $pointer.client_y - $pointer.pan_y - $map.grid_size/2;
            new_figure($floating_object.obj);
        }

        grabbed_selection = false;
        
        making_selection = false;
        selection_box.width = 0;
        selection_box.height = 0;
        selection_box.x = -1;
        selection_box.y = -1;

    }
    
    // PIXI stuff
    let figure_sprites = {};

    onMount(() => {
        object_container.addChild(sprite_container);

        sprite_container.children.forEach(child => {
            sprite_container.removeChild(child);
            child.destroy();
        })

    })

    afterUpdate(() => {

        Object.keys(figure_sprites).forEach(figure_sprite_id => {
            figure_sprites[figure_sprite_id].marked_for_death = true;
        })


        
        figures.forEach(async figure => {

            if (figure_sprites[figure.id] == null) {
                // Make new figure

                figure_sprites[figure.id] = {}; // Fixes a bug where, if you placed a sprite and the update function runs again (like if you move the mouse) it would see the figure sprite as null even though it was loading, so it would load like 13 of them at once
                
                let new_sprite_texture = await PIXI.Assets.load(figure.base64)
                
                
                let scale = $map.grid_size / new_sprite_texture.width;
                
                let new_sprite = new PIXI.Sprite(new_sprite_texture);
                new_sprite.eventMode = 'static';
                new_sprite.on('pointerenter', (e) => {figure_pointerenter(e, figure, new_sprite)})
                new_sprite.on('pointerout', (e) => {figure_pointerout(e, figure, new_sprite)})
                new_sprite.on('pointerdown', (e) => {figure_pointerdown(e, figure, new_sprite)})
                new_sprite.on('pointerup', (e) => {figure_pointerup(e, figure, new_sprite)})
                new_sprite.scale.set(scale);
                figure_sprites[figure.id] = new_sprite;

                sprite_container.addChild(new_sprite);
                console.log(`Added ${figure.id}`);
            }

            figure_sprites[figure.id].x = figure.x;
            figure_sprites[figure.id].y = figure.y;

            figure_sprites[figure.id].marked_for_death = false;
            
        });


        Object.keys(figure_sprites).forEach(figure_sprite_id => {
            if (figure_sprites[figure_sprite_id].marked_for_death) {
                console.log(`Removing ${figure_sprite_id}`)
                sprite_container.removeChild(figure_sprites[figure_sprite_id]);
                figure_sprites[figure_sprite_id].destroy();
            }
        })


        // UI Graphics
        ui_graphics.clear();
        ui_graphics.lineStyle(1, 0x666666);
        
        Object.keys(prospective_selected_figures).forEach(figure_id => {
            let fs = figure_sprites[figure_id]
            ui_graphics.drawRect(fs.x-5, fs.y-5, fs.width+10, fs.height+10);
        })
        
        ui_graphics.lineStyle(1, 0xffffff);
        let selected_ids = Object.keys(selected_figures)
        selected_ids.forEach(figure_id => {
            let fs = figure_sprites[figure_id]
            ui_graphics.drawRect(fs.x-5, fs.y-5, fs.width+10, fs.height+10);
            
        })
        
        if (selected_ids.length > 1) {
            // Draw a big box around all of them
        }

        if (making_selection) {

            let box_x = Math.min(selection_box.x, selection_box.x + selection_box.width);
            let box_y = Math.min(selection_box.y, selection_box.y + selection_box.height);

            let box_width = Math.abs(selection_box.width);
            let box_height = Math.abs(selection_box.height);
            
            ui_graphics.lineStyle(1, 0x888888);
            ui_graphics.beginFill(0x888888, 0.5);
            ui_graphics.drawRect(box_x, box_y, box_width, box_height);
            ui_graphics.endFill();


        }

        // Remove figures that don't exist anymore

    })


</script>

<div class="layer-activator">{update}</div>