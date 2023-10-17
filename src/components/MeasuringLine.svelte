<script>
    import { afterUpdate, onMount } from "svelte";

    import * as PIXI from 'pixi.js';

    export let points;
    export let graphics;
    export let line_style = new PIXI.LineStyle();
    line_style.color = 0x000000;
    line_style.width = 5;

    function drawLine(g, p1_x, p1_y, p2_x, p2_y) {

        g.moveTo(p1_x, p1_y);
        g.lineTo(p2_x, p2_y);

    }

    onMount(() => {
        
        graphics.lineStyle(5, 0x000000);
        drawLine(graphics, points[0], points[1], points[2], points[3]);
        
    })
    
    afterUpdate(() => {

        graphics.clear();

        console.log(line_style);

        graphics.lineStyle(5, 0x000000);
        drawLine(graphics, points[0], points[1], points[2], points[3]);
        
    })
    
    

</script>


