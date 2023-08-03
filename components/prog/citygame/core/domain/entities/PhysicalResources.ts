import { GridDrawer } from "../../infrastructure/GridDrawer";
import { IDrawable } from "../backbone/IDrawable";
import { ResourceType } from "../value_objects/Resources";

export class PhysicalResource implements IDrawable {
    zindex: number = 0;
    // to override

    constructor(public gridPos: { x: number, y: number }, public amount: number, public icon: string = "", public ResourceType: ResourceType) {
    }

    draw(gridDrawer: GridDrawer): void {
        gridDrawer.drawImage(this.gridPos.x, this.gridPos.y, this.icon);
    }

    isOnGridPos(gridPos: { x: number; y: number; }): boolean {
        return this.gridPos.x === gridPos.x && this.gridPos.y === gridPos.y;
    }
}

export class Tree extends PhysicalResource {
    constructor(gridPos: { x: number, y: number }, amount: number) {
        super(gridPos, amount, 'tree.png', ResourceType.Wood);
    }
}

export class Rock extends PhysicalResource {
    constructor(gridPos: { x: number, y: number }, amount: number) {
        super(gridPos, amount, 'rock.png', ResourceType.Stone);
    }
}