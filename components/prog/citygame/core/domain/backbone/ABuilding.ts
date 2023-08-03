import { GridDrawer } from "../../infrastructure/GridDrawer";
import { IDrawable } from "./IDrawable";

// ABuilding ts
export class ABuilding implements IDrawable {
    zindex: number = 0;
    constructor(public name: string, public gridPos: { x: number, y: number }, public icon: string = "") {
    }

    // draw in the cell of the grid (25x25)
    draw(gridDrawer: GridDrawer): void {
        // if icon is not empty, draw icon
        if (this.icon !== "") {
            gridDrawer.drawImage(this.gridPos.x, this.gridPos.y, this.icon);
            return;
        }
        gridDrawer.drawText(this.gridPos.x, this.gridPos.y, this.name.substring(0, 1));
    }

    isOnGridPos(gridPos: { x: number; y: number; }): boolean {
        return this.gridPos.x === gridPos.x && this.gridPos.y === gridPos.y;
    }
}