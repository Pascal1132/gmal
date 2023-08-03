import { ABuilding } from "../backbone/ABuilding";
import { GridPos } from "../value_objects/GridPos";

export class Cottage extends ABuilding {
    private static instance: Cottage;
    private constructor(gridPos: { x: number; y: number; }) {
        super("Cottage", gridPos, 'cottage.png');
    }

    public static getInstance({gridPos}): Cottage {
        if (!Cottage.instance) {
            Cottage.instance = new Cottage(gridPos);
        }
        return Cottage.instance;
    }
}