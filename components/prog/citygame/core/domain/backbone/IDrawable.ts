import { GridDrawer } from "../../infrastructure/GridDrawer";

export interface IDrawable{
    draw(gridDrawer:GridDrawer): void;
    isOnGridPos(gridPos: {x: number, y: number}): boolean;
    zindex: number;
}