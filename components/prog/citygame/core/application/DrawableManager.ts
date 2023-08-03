import { IDrawable } from "../domain/backbone/IDrawable";
import { Cottage } from "../domain/entities/Cottage";
import { Person } from "../domain/entities/Person";
import { Rock, Tree } from "../domain/entities/PhysicalResources";
import { GridDrawer } from "../infrastructure/GridDrawer";

class DrawableManager {

    private drawables: IDrawable[];
    constructor() {
        this.init();
    }
    add(drawable) {
        this.drawables.push(drawable);
    }
    remove(drawable) {
        this.drawables = this.drawables.filter(d => d !== drawable);
    }
    isOccupied(gridPos) {
        return this.drawables.some(d => d.isOnGridPos(gridPos));
    }
    getAllDrawables(gridPos: { x: number; y: number; }) {
        return this.drawables.filter(d => d.isOnGridPos(gridPos));
    }
    draw(gridDrawer: GridDrawer) {
        // order by zindex
        this.drawables.sort((a, b) => a.zindex - b.zindex);
        this.drawables.forEach(d => d.draw(gridDrawer));
    }
    public init() {
        this.drawables = [
            Person.getInstance({ gridPos: { x: 0, y: 0 } }),
            Cottage.getInstance({ gridPos: { x: 1, y: 1 } }),
        ];

        // random position of 
        const types = [Tree, Rock];

        for (let i = 0; i < 10; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const x = Math.floor(Math.random() * 25);
            const y = Math.floor(Math.random() * 25);
            this.drawables.push(new type({ x, y }, 100000));
        }

    }
}

const drawableManager = new DrawableManager();

export default drawableManager;