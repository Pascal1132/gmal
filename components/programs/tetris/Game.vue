<template>
    <div class="container">
        <tetris ref="tetris"></tetris>
    </div>
</template>

<script>
import Tetris from './tetris.vue'
export default {
    name: 'Game',
    components: {
        Tetris
    },
    methods: {
        start() {
            this.$refs.tetris.start();
        },
    },
    beforeDestroy() {
        this.$refs.tetris.clearTick();
    },
}
</script>

<style lang="scss">
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0;


    overflow: auto;
    >* {
    }
}
</style>