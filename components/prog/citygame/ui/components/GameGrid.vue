<template>
    <div>
        <canvas ref="canvas" @wheel="handleMouseWheel" @mousemove="handleMouseMove" @mousedown="mouseDown" @mouseup="mouseUp"></canvas>
    </div>
</template>
  
<script>
import drawableManager from '../../core/application/DrawableManager'
import EventManager from '../../core/application/EventManager'
import { Loop } from '../../core/application/Loop'
import toolbarManager from '../../core/application/ToolbarManager'
import { Person } from '../../core/domain/entities/Person'
import { GridDrawer } from '../../core/infrastructure/GridDrawer'

export default {
    data() {
        return {
            cellSize: 150,
            canvasHeight: 500,
            cellsPerSide: 25,
            offsetX: 0,
            offsetY: 0,
            isDragging: false,
            showGrid: false,
        }
    },
    props: {
        drawables: {
            type: Array,
            default: () => []
        }
    },

    mounted() {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d');

        // get the window width (.city-game width) and set the canvas width and height
        this.canvas.height = this.canvasHeight
        Loop.getInstance().attach(this.onLoop);
        Loop.getInstance().start();
        this.$nextTick(() => {
            this.canvas.width = document.querySelector('.city-game').offsetWidth
        });
        toolbarManager.attach((selected = null) => {
            if (selected) {
                this.canvas.style.cursor = 'pointer'
                this.showGrid = true;
            } else {
                this.canvas.style.cursor = 'default'
                this.showGrid = false;
            }
        });
        EventManager.getInstance().addEventListener('keydown', (e) => {
            // if the Person.getInstance is outside the visible area, move the grid
            const person = Person.getInstance();
        });
    },

    beforeDestroy() {
        Loop.getInstance().detach(this.onLoop);
    },

    methods: {
        drawGrid() {
            const gridDrawer = new GridDrawer(this.cellSize, this.offsetX, this.offsetY, this.cellsPerSide, this.canvasHeight, this.ctx);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            gridDrawer.drawBorder();
            if (this.showGrid) {
                // Dessiner la grille
                gridDrawer.drawGrid();
            }

            // Dessiner les objets
            drawableManager.draw(gridDrawer);
        },
        handleMouseWheel(e) {
            if (e.deltaY < 0) {
                if (this.cellSize >= 200) return
                this.cellSize += 5
            } else {
                if (this.cellSize <= 50) return
                this.cellSize -= 5
            }
            this.drawGrid()
        },

        handleMouseMove(e) {
            if (this.isDragging) {
                    this.offsetX -= e.movementX
                    this.offsetY -= e.movementY
                    this.drawGrid()
            }
        },
        mouseDown(e) {
            this.isDragging = true
        },
        mouseUp(e) {
            if (!e) {
                this.isDragging = false
                return
            }
            this.isDragging = false
            // get the cell under the mouse
            const cellX = Math.floor((e.offsetX + this.offsetX) / this.cellSize)
            const cellY = Math.floor((e.offsetY + this.offsetY) / this.cellSize)

            // create a new cottage at the cell position if the Toolbar selected item is Cottage
            if (toolbarManager.isSelecting()) {
                toolbarManager.addCurrentToDrawable(cellX, cellY);
            }
        },
        onLoop() {
            this.drawGrid();
        },
   
    }
}
</script>