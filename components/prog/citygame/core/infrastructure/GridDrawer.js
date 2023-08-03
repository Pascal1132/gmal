import { ImageLoader } from "./ImageLoader";
const BASE_IMAGE_PATH = "images/programs/citygame/";

export class GridDrawer {

    /**
         const gridDrawer = new GridDrawer(this.cellSize, this.offsetX, this.offsetY, this.cellsPerSide, this.canvas, this.ctx);

     */
    constructor(cellSize, offsetX, offsetY, cellsPerSide, canvas, ctx) {
        this.cellSize = cellSize;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.cellsPerSide = cellsPerSide;
        this.canvas = canvas;
        this.ctx = ctx;
    }

    drawText(x, y, text, color = "white") {
        this.ctx.fillStyle = color;
        // fill text with font size 1/2 of cell size
        this.ctx.font = `${this.cellSize / 2}px Arial`;
        const cellX = x * this.cellSize - this.offsetX;
        const cellY = y * this.cellSize - this.offsetY;
        // clear the cell
        this.ctx.clearRect(cellX, cellY, this.cellSize - 1, this.cellSize - 1);
        this.ctx.fillText(text, cellX + this.cellSize / 2, cellY + this.cellSize / 2);
    }

    drawImage(x, y, icon) {
        // if x and y are out of the grid, do nothing
        if (x < 0 || x >= this.cellsPerSide || y < 0 || y >= this.cellsPerSide) {
            return;
        }
        const cellX = x * this.cellSize - this.offsetX;
        const cellY = y * this.cellSize - this.offsetY;
        this.ctx.drawImage(ImageLoader.loadFromPath(BASE_IMAGE_PATH + icon), cellX, cellY, this.cellSize, this.cellSize);
    }

    drawGrid() {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // color font
        this.ctx.fillStyle = "white";

        // Boucle pour dessiner les cellules visibles
        for (let y = 0; y < this.cellsPerSide; y++) {
            for (let x = 0; x < this.cellsPerSide; x++) {
                const cellX = x * this.cellSize - this.offsetX
                const cellY = y * this.cellSize - this.offsetY

                this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
                this.ctx.font = '10px sans-serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(`${x},${y}`, cellX + this.cellSize / 2, cellY + this.cellSize / 2);
            }
        }
    }

    // Draw the border just to see the max size of the grid
    drawBorder() {
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        
        // calculate the max X and Y of the grid (in pixels)
        const maxX = this.cellsPerSide * this.cellSize;
        const maxY = this.cellsPerSide * this.cellSize;

        this.ctx.strokeRect(0, 0, maxX, maxY);

        // draw the border of the grid
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

}