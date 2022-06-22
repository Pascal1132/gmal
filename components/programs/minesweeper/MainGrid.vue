<template>
    <div class="grid">
        <div v-for="row in rows" :key="row" class="row">
            <div v-for="(cell, col) in cellsByThisRow(row)" :key="col" >
                <div class="cell-content" @click="revealCell(row, col)">
                    <span>{{ cell != null ? '' : 'N'}}</span>
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
            };
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
                default: 10,
            },
        },
        created() {
            this.generateCells();
        },
        methods: {
            generateCells() {
                this.cells = [];
                for (let row = 1; row <= this.rows; row++) {
                    this.cells[row] = this.cells[row] || [];
                    for (let col = 1; col <= this.cellsByRows; col++) {
                        this.cells[row][col] = {
                            isMine: false,
                            isRevealed: false,
                            isFlagged: false,
                        };
                    }
                }
                // set up mines
                for (let i = 0; i < this.numberOfMines; i++) {
                    let row = Math.floor(Math.random() * this.rows);
                    let col = Math.floor(Math.random() * this.cellsByRows);
                    let cell = this.getCell(row + 1, col + 1);
                    if (cell != null && !cell.isMine) {
                        cell.isMine = true;
                    } else {
                        i--;
                    }
                }
                // setup numbers
                for (let row = 1; row <= this.rows; row++) {
                    for (let col = 1; col <= this.cellsByRows; col++) {
                        let cell = this.getCell(row, col);
                        if (cell != null && !cell.isMine) {
                            let number = 0;
                            for (let i = -1; i <= 1; i++) {
                                for (let j = -1; j <= 1; j++) {
                                    let neighbor = this.getCell(row + i, col + j);
                                    if (neighbor != null && neighbor.isMine) {
                                        number++;
                                    }
                                }
                            }
                            cell.number = number;
                        }
                    }
                }
            },
            getCell(row, col) {
                // check if row exists
                if (!this.cells[row] || !this.cells[row][col]) {
                    return null;
                }
                return this.cells[row][col];
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
                };
            },
            revealCell(row, col) {
                let cell = this.getCell(row, col);
                if (cell.isMine) {
                    cell.isError = true;
                } else if (cell.isNumber) {
                    cell.isRevealed = true;
                } else {
                    cell.isRevealed = true;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            let neighbor = this.getCell(row + i, col + j);
                            if (neighbor != null && !neighbor.isRevealed && !neighbor.isMine) {
                                this.revealCell(row + i, col + j);
                            }
                        }
                    }
                }
                console.log(cell.isRevealed);

                if (this.isGameOver()) {
                    this.gameOver();
                }

                // get all reveal cells
                /*let revealCells = [];
                for (let row = 1; row <= this.rows; row++) {
                    for (let col = 1; col <= this.cellsByRows; col++) {
                        let cell = this.getCell(row, col);
                        if (cell.isRevealed) {
                            revealCells.push(cell);
                        }
                    }
                }

                this.$store.commit('windows/setWindow', {
                    id: this.windowKey,
                    title: 'Démineur (t\'as perdu)',
                });*/
            },
            isGameOver() {
                for (let row = 1; row <= this.rows; row++) {
                    for (let col = 1; col <= this.cellsByRows; col++) {
                        let cell = this.getCell(row, col);
                        if (!cell.isRevealed && !cell.isMine) {
                            return false;
                        }
                    }
                }
                return true;
            },
            gameOver() {
                for (let row = 1; row <= this.rows; row++) {
                    for (let col = 1; col <= this.cellsByRows; col++) {
                        let cell = this.getCell(row, col);
                        if (cell.isMine) {
                            cell.isRevealed = true;
                        }
                    }
                }
            },
            flagCell(row, col) {
                let cell = this.getCell(row, col);
                if (cell.isRevealed) {
                    return;
                }
                cell.isFlagged = !cell.isFlagged;
            },
            questionMarkCell(row, col) {
                let cell = this.getCell(row, col);
                if (cell.isRevealed) {
                    return;
                }
                cell.isQuestionMarked = !cell.isQuestionMarked;
            },
            cellsByThisRow(row) {
                return this.cells[row];
            },
        },
        computed: {
            getCellsOnlyTextToDisplay() {
                return this.cells.map(row => row.map(cell => {
                    if (cell.isRevealed) {
                        if (cell.isMine) {
                            return '💣';
                        } else if (cell.isNumber) {
                            return cell.number;
                        } else {
                            return ' ';
                        }
                    } else if (cell.isFlagged) {
                        return '🚩';
                    } else if (cell.isQuestionMarked) {
                        return '❓';
                    } else {
                        return ' ';
                    }
                }));
            },
            
        }
    }
</script>
<style lang="scss" scoped>
.grid {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    padding: 10px;
    border: 2px solid $border-color;
    .cell-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        margin: 4px;
        background-color: $bg-color-2;
        box-sizing: border-box;
        transition: $transition;
        border: 2px solid transparent;

        &:hover {
            border: 2px solid $border-color;
        }
    }
}
</style>