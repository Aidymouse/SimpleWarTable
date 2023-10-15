<script>

    import { afterUpdate, onMount, tick } from "svelte";

    import { pointer } from "../stores/pointer";
    import { floating_object } from "../stores/floating_object";
    import { map } from "../stores/map";
    import { keys } from "../stores/keys";

    import * as PIXI from 'pixi.js';

    export let app;
    export let object_container;
    export let ui_graphics;

    let objects = [];

    let id = 1;

    let sprite_container = new PIXI.Container();
    let ui_selection = new PIXI.Graphics();

    let selected_objects = {};

    let grabbed_selection = false;
    let hovering_selection = false;

    let making_selection = false;
    let selection_box = { x: -1, y: -1, w: 0, h: 0 }

    let creating_selection = false;
    
    let prospective_selected_objects = {};

    let update = false;

    export function new_object(object) {
        object.id = id;
        objects.push(object);
        prospective_selected_objects[id] = object;
        id++;
        update = !update;
    }
    
    function get_obj(id) {
        return objects.find(o => o.id == id);
    }


    function object_pointerenter (e, fgr, spr) {
        prospective_selected_objects[fgr.id] = fgr;
        update = !update;
    }
    
    function object_pointerout (e, fgr, spr) {
        delete prospective_selected_objects[fgr.id];
        update = !update;
    }
    
    function object_pointerdown (e, fgr, spr) {
        if (e.button != 0) return;
        
        // If shift not held...
        
        // Not currently selected
        if (selected_objects[fgr.id] == null) {
            
            if (!$keys.down["Shift"]) {
                selected_objects = {};
            }

            selected_objects[fgr.id] = fgr;
            
            
        } else {
            if ($keys.down["Shift"]) {
                delete selected_objects[fgr.id];
                return;
            }

        }

        grabbed_selection = true;

        update = !update;
    }
    
    function object_pointerup(e, fgr, spr) {
        
        grabbed_selection = false;

      
        
        update = !update;
    }
    



    export function pointerdown(e) {
        
        if (Object.keys(prospective_selected_objects).length == 0) {
            if (!$keys.down["Shift"]) {
                selected_objects = {};
            }
            
            making_selection = true;
            selection_box.x = $pointer.world_x;
            selection_box.y = $pointer.world_y;

            update = !update;
        }
        
    }

    export function pointermove(e) {
        if (grabbed_selection) {
            Object.keys(selected_objects).forEach(f_id => {
                selected_objects[f_id].x += $pointer.delta_x;
                selected_objects[f_id].y += $pointer.delta_y;
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
            new_object($floating_object.obj);
        }

        grabbed_selection = false;
        
        if (making_selection) {
            Object.keys(prospective_selected_objects).forEach(pros_obj_id => {
                selected_objects[pros_obj_id] = get_obj(pros_obj_id)
            });
            prospective_selected_objects = {};
        }
        
        making_selection = false;
        selection_box.width = 0;
        selection_box.height = 0;
        selection_box.x = -1;
        selection_box.y = -1;
        
        update = !update;
    }
    

    function get_bounding_box(object_sprite, margin) {
        return {
            x: object_sprite.x-margin,
            y: object_sprite.y-margin,
            width: object_sprite.width+margin*2,
            height: object_sprite.height+margin*2
        }
    }

    function AABB(box_1, box_2) {

        let t = box_1.x < box_2.x+box_2.width && box_1.x + box_1.width > box_2.x && box_1.y < box_2.y+box_2.height && box_1.y+box_1.height > box_2.y;
        return t;
    }

    // PIXI stuff
    let object_sprites = {};

    onMount(() => {
        object_container.addChild(sprite_container);

        sprite_container.children.forEach(child => {
            sprite_container.removeChild(child);
            child.destroy();
        })

    })

    let selection_border_margin = 5;

    afterUpdate(() => {

        Object.keys(object_sprites).forEach(object_sprite_id => {
            object_sprites[object_sprite_id].marked_for_death = true;
        })


        
        objects.forEach(async obj => {

            if (object_sprites[obj.id] == null) {
                // Make new object

                object_sprites[obj.id] = {}; // Fixes a bug where, if you placed a sprite and the update function runs again (like if you move the mouse) it would see the object sprite as null even though it was loading, so it would load like 13 of them at once
                
                let new_sprite_texture = await PIXI.Assets.load(obj.base64)
                
                
                let scale = $map.grid_size / new_sprite_texture.width;
                
                let new_sprite = new PIXI.Sprite(new_sprite_texture);
                new_sprite.eventMode = 'static';
                new_sprite.on('pointerenter', (e) => {object_pointerenter(e, obj, new_sprite)})
                new_sprite.on('pointerout', (e) => {object_pointerout(e, obj, new_sprite)})
                new_sprite.on('pointerdown', (e) => {object_pointerdown(e, obj, new_sprite)})
                new_sprite.on('pointerup', (e) => {object_pointerup(e, obj, new_sprite)})
                new_sprite.scale.set(scale);
                object_sprites[obj.id] = new_sprite;

                sprite_container.addChild(new_sprite);
                console.log(`Added ${obj.id}`);
            }

            object_sprites[obj.id].x = obj.x;
            object_sprites[obj.id].y = obj.y;

            object_sprites[obj.id].marked_for_death = false;
            
        });


        Object.keys(object_sprites).forEach(object_sprite_id => {
            if (object_sprites[object_sprite_id].marked_for_death) {
                console.log(`Removing ${object_sprite_id}`)
                sprite_container.removeChild(object_sprites[object_sprite_id]);
                object_sprites[object_sprite_id].destroy();
            }
        })

        // Selection Identification
        if (making_selection) {

            prospective_selected_objects = {};

            let selection_AABB = {
                x: Math.min(selection_box.x, selection_box.x+selection_box.width),
                y: Math.min(selection_box.y, selection_box.y+selection_box.height),
                width: Math.abs(selection_box.width),
                height: Math.abs(selection_box.height),
            }

            objects.forEach(obj => {

                if (AABB(get_bounding_box(object_sprites[obj.id], 0), selection_AABB) ) {
                    prospective_selected_objects[obj.id] = obj;
                }

            })

        }

        // UI Graphics
        ui_graphics.clear();
        ui_graphics.lineStyle(1, 0x666666);
        
        Object.keys(prospective_selected_objects).forEach(object_id => {
            let fs = object_sprites[object_id]
            let bb = get_bounding_box(fs, 5)
            ui_graphics.drawRect( bb.x, bb.y, bb.width, bb.height );
        })
        
        ui_graphics.lineStyle(1, 0x888888);
        let selected_ids = Object.keys(selected_objects)
        selected_ids.forEach(object_id => {
            let fs = object_sprites[object_id]
            let bb = get_bounding_box(fs, 5);
            ui_graphics.drawRect( bb.x, bb.y, bb.width, bb.height );
        })
        
        if (selected_ids.length > 0) {
            // Draw a big box around all of them
            
            let left_most_x = Infinity;
            let right_most_x = -Infinity;
            let top_most_y = Infinity;
            let bottom_most_y = -Infinity;
            
            selected_ids.forEach(s_id => {
                left_most_x = Math.min(object_sprites[s_id].x, left_most_x);
                right_most_x = Math.max(object_sprites[s_id].x + object_sprites[s_id].width, right_most_x);

                top_most_y = Math.min(object_sprites[s_id].y, top_most_y);
                bottom_most_y = Math.max(object_sprites[s_id].y + object_sprites[s_id].height, bottom_most_y);
            });

            console.log(left_most_x, right_most_x);
            
            ui_graphics.lineStyle(1, 0xffffff);
            let selection_bb = get_bounding_box({x: left_most_x, y: top_most_y, width: right_most_x-left_most_x, height: bottom_most_y-top_most_y}, 5)
            ui_graphics.drawRect(selection_bb.x, selection_bb.y, selection_bb.width, selection_bb.height);

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

        // Remove objects that don't exist anymore

    })


</script>

<div class="layer-activator">{update}</div>