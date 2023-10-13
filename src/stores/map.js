import { writable } from "svelte/store";

export let map = writable({

    major_measure: 1,
    unit: "inch",

    grid_size: 50,

});