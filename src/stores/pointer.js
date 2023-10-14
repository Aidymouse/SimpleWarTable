import { writable } from "svelte/store";

export let pointer = writable({
    pan_x: 0,
    pan_y: 0,

    panning: false,

    client_x: 0,
    client_y: 0,

    last_client_x: 0,
    last_client_y: 0,

    delta_x: 0,
    delta_y: 0,

    world_x: 0,
    world_y: 0,
})