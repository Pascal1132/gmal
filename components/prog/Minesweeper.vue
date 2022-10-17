<template>
  <div class="minesweeper">
    <div class="header">
      <button @click="restart()">Restart</button>
      <label>
        Mines:
        <input type="text" @change="changeMines" :max="(cellsByRows * rows) - 1" :value="numberOfMines"/>
      </label>
      <label>
        Colonnes:
        <input type="text" @change="changeCols" :value="cellsByRows"/>
      </label>
      <label>
        Lignes:
        <input type="text" @change="changeRows" :value="rows"/>
      </label>
    </div>
    <span class="message">{{message}}</span>
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
            message: '',
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
        changeMines(e) {
            // check if mines are less than cellsByRows * rows minus 8
            if (e.target.value > (this.cellsByRows * this.rows) - 9) {
                this.numberOfMines = (this.cellsByRows * this.rows) - 9;
                this.displayMessage('Mines cannot be more than ' + (parseInt(this.cellsByRows * this.rows) - 9));
            } else if (e.target.value < 0) {
                this.numberOfMines = 0;
                this.displayMessage('Mines cannot be less than 0');
            } else {
                this.numberOfMines = e.target.value;
            }
        },
        changeCols(e) {
            // check if cols are less than 4
            if (e.target.value < 4) {
                this.cellsByRows = 4;
                this.displayMessage('Cols cannot be less than 4');
            } else {
                this.cellsByRows = parseInt(e.target.value);
            }

            if (this.numberOfMines > (this.cellsByRows * this.rows) - 9) {
                this.numberOfMines = (this.cellsByRows * this.rows) - 9;
            }
            
        },
        changeRows(e) {
            // check if rows are less than 4
            if (e.target.value < 4) {
                this.rows = 4;
                this.displayMessage('Rows cannot be less than 4');
            } else {
                this.rows = parseInt(e.target.value);
            }

            if (this.numberOfMines > (this.cellsByRows * this.rows) - 9) {
                this.numberOfMines = (this.cellsByRows * this.rows) - 9;
            }
        },
        displayMessage(message) {
            this.message = message;
            setTimeout(() => {
                this.message = '';
            }, 2000);
        },

    },
    mounted() {
      this.$emit('set-window-frame',  {
            id: this.windowKey,
            title: 'Des mineurs',
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
  .message {
    font-size: 1rem;
    color: $danger-color;
    text-align: center;
    width: 100%;
    height: 20px;
  }

  .body {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    overflow: auto;
    height: calc(100% - 140px);
    gap: 10px;
    padding: 0 10px;
  }
}
</style>
