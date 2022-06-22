<template>
    <div class="minesweeper">
        <div class="header"><button @click="restart()">Restart</button></div>
        <div class="body"><main-grid ref="mainGrid"/></div>
    </div>
</template>
<script lang="js">
import MainGrid from "./minesweeper/MainGrid.vue";
import Timer from "./minesweeper/Timer.vue";
export default {
    name: 'Minesweeper',
    components: {
        MainGrid, Timer,
    },
    props: {
        windowKey: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        restart() {
            this.$refs.mainGrid.generateCells();
        },
    },
    mounted() {
        this.$store.commit('windows/setWindow', {
            id: this.windowKey,
            title: 'Démineur',
            size: {
                width: 700,
                height: 500,
                minWidth: 500,
                minHeight: 400,
            },
            iconPath: 'images/minesweeper.png',
        });
    },
}
</script>
<style lang="scss" scoped>
.minesweeper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 10px;
    padding: 0 10px;
    overflow: auto;

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 50px;
        gap: 10px;
        padding: 0 10px;
    }

    .body {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        overflow: auto;
        height: calc(100% - 100px);
        gap: 10px;
        padding: 0 10px;
    }
}
</style>