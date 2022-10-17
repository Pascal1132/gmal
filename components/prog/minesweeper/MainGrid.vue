<template>
  <div class="grid">
    <div
      class="game-over-curtain"
      :class="{ show: isGameOver, won: isGameWon }"
    >
      <div class="curtain-text">
        Vous avez {{ isGameWon ? 'gagné ! 🤩' : 'perdu !😭' }}
      </div>
    </div>
    <div v-for="(row, rowIndex) in cells" :key="rowIndex" class="row">
      <div v-for="(cell, colIndex) in row" :key="colIndex" class="col">
        <div
          class="cell-content"
          @click="revealCell(cell, rowIndex, colIndex)"
          @contextmenu.prevent="flagCell(cell, rowIndex, colIndex)"
          :class="{ revealed: cell.isRevealed, error: cell.isError }"
        >
          <span>
            {{ (cell.isRevealed ? (cell.isMine ? (cell.isError ? '💥' : '💣') : cell.number) : (
              cell.isFlagged ? '🚩' : (cell.isQuestionMarked ? '❓' : ' ')
            )) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainGrid',
  data() {
    return {
      cells: [],
      isGameOver: false,
      isGameWon: false,
    }
  },
  props: {
    rows: {
      type: Number,
      default: 10,
    },
    cellsByRows: {
      type: Number,
      default: 10,
    },
    numberOfMines: {
      type: Number,
      default: 1,
    },
  },
  created() {
    this.generateCells()
  },
  methods: {
    generateCells() {
      this.isGameOver = false
      this.cells = []
      for (let row = 0; row < this.rows; row++) {
        this.cells[row] = this.cells[row] || []
        for (let col = 0; col < this.cellsByRows; col++) {
          this.cells[row][col] = {
            isMine: false,
            isRevealed: false,
            isFlagged: false,
          }
        }
      }
    },
    getCell(row, col) {
      // check if row exists
      if (!this.cells[row] || !this.cells[row][col]) {
        return null
      }
      return this.cells[row][col]
    },
    generateBaseCell() {
      return {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        isQuestionMarked: false,
        isError: false,
        isEmpty: false,
        isNumber: false,
        number: 0,
      }
    },
    revealCell(cell, row, col) {
      // if there is no cell revealed, generate the grid
      if (!this.checkIfACellIsReaveled()) {
        // set up mines
        for (let i = 0; i < this.numberOfMines; i++) {
          let tempRow = Math.floor(Math.random() * this.rows)
          let tempCol = Math.floor(Math.random() * this.cellsByRows)
          let tempCell = this.getCell(tempRow, tempCol)
          // dont place a mine on cell passed as param and all around
          let isNotNearCells = true
          for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
              if (row + j == tempRow && col + k == tempCol) {
                isNotNearCells = false
              }
            }
          }

          if (tempCell != null && !tempCell.isMine && isNotNearCells) {
            tempCell.isMine = true
          } else {
            i--
          }
        }
        // setup numbers
        for (let tempRow = 0; tempRow < this.rows; tempRow++) {
          for (let tempCol = 0; tempCol < this.cellsByRows; tempCol++) {
            let tempCell = this.getCell(tempRow, tempCol)
            if (tempCell != null && !tempCell.isMine) {
              let number = 0
              for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                  let neighbor = this.getCell(tempRow + i, tempCol + j)
                  if (neighbor != null && neighbor.isMine) {
                    number++
                  }
                }
              }
              tempCell.isNumber = number > 0
              tempCell.number = tempCell.isNumber ? number : ''
            }
          }
          this.updateRow(tempRow);
        }
      }

      if (cell.isMine) {
        cell.isError = true
        this.gameOver(false)
      } else if (cell.isNumber) {
        cell.isRevealed = true
      } else {
        cell.isRevealed = true
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            let neighbor = this.getCell(row + i, col + j)
            if (neighbor != null && !neighbor.isRevealed && !neighbor.isMine) {
              this.revealCell(neighbor, row + i, col + j)
            }
          }
        }
      }

      if (this.checkIfGameOver()) {
        this.gameOver()
      }

      this.updateCell(cell, row, col)
    },
    checkIfGameOver() {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cellsByRows; col++) {
          let cell = this.getCell(row, col)
          if (!cell.isRevealed && !cell.isMine) {
            return false
          }
        }
      }
      return true
    },
    checkIfACellIsReaveled() {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cellsByRows; col++) {
          let cell = this.getCell(row, col)
          if (cell.isRevealed) {
            return true
          }
        }
      }
      return false
    },
    gameOver(success = true) {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cellsByRows; col++) {
          let cell = this.getCell(row, col)
          if (cell.isMine) {
            cell.isRevealed = true
          }
        }
      }
      this.isGameOver = true
      this.isGameWon = success
    },
    flagCell(cell, row, col) {
      if (cell.isRevealed) {
        return
      }
      if (!cell.isFlagged && !cell.isQuestionMarked) {
        cell.isFlagged = true
      } else if (!cell.isQuestionMarked) {
        cell.isFlagged = false
        cell.isQuestionMarked = true
      } else {
        cell.isQuestionMarked = false
      }
      this.updateCell(cell, row, col)
    },
    updateCell(cell, row, col) {
      this.updateRow(row)
      // Dont use set in vue 3 this.$set(this.cells[row], col, cell)
      this.cells[row][col] = cell
    },
    updateRow(row) {
      // Dont use set in vue 3 this.$set(this.cells, row, this.cells[row])
      this.cells[row] = this.cells[row];
    },
  },
  watch: {
    rows: {
      handler() {
        this.generateCells()
      },
      deep: true,
    },
    cellsByRows: {
      handler() {
        this.generateCells()
      },
      deep: true,
    },
    numberOfMines: {
      handler() {
        this.generateCells()
      },
      deep: true,
    },
  },
}
</script>
<style lang="scss" scoped>
.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  position: relative;
  padding: 10px;
  border: 2px solid $border-color;
  .game-over-curtain {
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    opacity: 0;
    border: 2px solid rgba($hex-danger-color, 0.5);
    backdrop-filter: brightness(60%);
    transform: translateY(-100%);
    z-index: 10;
    .curtain-text {
      font-size: 20px;
      padding: 10px;
      text-align: center;
      font-weight: bolder;
      text-transform: uppercase;
    }

    &.show {
      height: 100%;
      width: 100%;
      transform: translateY(0);
      opacity: 1;
      transition: opacity 1s ease-in-out;
      transition-delay: 1s;
    }
    &.won {
      border-color: $success-color;
    }
  }
  .row {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .cell-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        margin: 4px;
        background-color: $bg-color-2;
        box-sizing: border-box;
        transition: $transition;
        border: 2px solid transparent;
        span {
          transform: scale(1);
          transition: transform 2s ease-in-out;
        }

        &.revealed {
          background-color: $bg-color-1;
          border: 2px solid $border-color;
        }
        &.error {
          span {
            transform: scale(3);
            z-index: 5;
          }
        }

        &:hover {
          border: 2px solid $border-color;
        }
      }
    }
  }
}
</style>
