<template>
  <div class="minesweeper">
    <div class="header">
      <button @click="restart()">Restart</button>
      <label>
        Mines:
        <input type="text" v-model="numberOfMines" min="0" :max="(cellsByRows * rows) - 1"/>
        
      </label>
      <label>
        Colonnes:
        <input type="text" v-model="cellsByRows" min="1" max="100"/>
      </label>
      <label>
        Lignes:
        <input type="text" v-model="rows" min="1" max="10"/>
      </label>
    </div>
    <div class="body"><main-grid ref="mainGrid" :numberOfMines="numberOfMines" :cellsByRows="cellsByRows" :rows="rows"/></div>
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
    data() {
        return {
            numberOfMines: 20,
            cellsByRows: 10,
            rows: 8,
        }
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
    justify-content: center;
    width: 100%;
    height: 50px;
    gap: 10px;
    padding: 0 10px;
    button {
      width: 100px;
      height: 30px;
      border-radius: $border-radius-sm;
      border-color: $border-color;
      background-color: $bg-color-0;
      color: $txt-color;
      font-size: 1rem;
      transition: $transition;
      cursor: pointer;
      &:hover {
        color: $highlight-color;
      }
    }
    input {
      width: 50px;
      height: 30px;
      border-radius: $border-radius-sm;
      border-color: $border-color;
      background-color: $bg-color-0;
      color: $txt-color;
      font-size: 1rem;
      transition: $transition;
      &:hover {
        color: $highlight-color;
      }
    }
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
