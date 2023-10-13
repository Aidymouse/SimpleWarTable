<script>
    import { onMount } from "svelte";

    import { keys } from "../stores/keys";

    onMount(() => {

        document.onkeydown = keydown
        document.onkeyup = keyup

    })

    function keydown(e) {
        console.log(e);
        $keys.down[e.key] = true
    }
    
    function keyup(e) {
        $keys.down[e.key] = false
    }
</script>