import { Loop } from "../../application/Loop";
import { GridDrawer } from "../../infrastructure/GridDrawer";
import { IDrawable } from "../backbone/IDrawable";
import { Person } from "./Person";

export class Zombie implements IDrawable{
    zindex: number = 1;
    private iconList = ['gold.png', 'gold.png'];
    private iconIndex = 0;
    public constructor(public gridPos: { x: number, y: number }) {
    }

    draw(gridDrawer: GridDrawer): void {
        // move
        this.move();
        if(Loop.ticks % 70 === 0) {
            this.iconIndex = (this.iconIndex + 1) % this.iconList.length;
        }
        gridDrawer.drawImage(this.gridPos.x, this.gridPos.y, this.iconList[this.iconIndex]);
    }

    move() {
        const personPos = Person.getInstance().gridPos;
        // calculate the unit vector
        const diffX = this.gridPos.x - personPos.x;
        const diffY = this.gridPos.y - personPos.y;

        const length = Math.sqrt(diffX * diffX + diffY * diffY);

        const unitX = diffX / length;

        const unitY = diffY / length;

        this.gridPos.x -= unitX;
        this.gridPos.y -= unitY;
    }

    isOnGridPos(gridPos: { x: number; y: number; }): boolean {
        return this.gridPos.x === gridPos.x && this.gridPos.y === gridPos.y;
    }

}