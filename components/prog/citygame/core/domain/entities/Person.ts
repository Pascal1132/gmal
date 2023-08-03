import drawableManager from "../../application/DrawableManager";
import EventManager from "../../application/EventManager";
import { Loop } from "../../application/Loop";
import resourceManager from "../../application/ResourceManager";
import { GridDrawer } from "../../infrastructure/GridDrawer";
import { IDrawable } from "../backbone/IDrawable";
import { PhysicalResource } from "./PhysicalResources";

export class Person implements IDrawable{
    zindex: number = 1;
    private iconList = ['person.png', 'person2.png'];
    private iconIndex = 0;
    private static instance: Person;
    private constructor(public gridPos: { x: number, y: number }) {
        // add listener to keydown event
        EventManager.getInstance().addEventListener('keydown', this.onKeyDown.bind(this), 'person');
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                this.gridPos.y -= 1;
                break;
            case 'ArrowDown':
                this.gridPos.y += 1;
                break;
            case 'ArrowLeft':
                this.gridPos.x -= 1;
                break;
            case 'ArrowRight':
                this.gridPos.x += 1;
                break;
        }
        const drawables = drawableManager.getAllDrawables(this.gridPos);
        const physicalResources = drawables.filter(d => d instanceof PhysicalResource);
        console.log(physicalResources);
        if (physicalResources.length > 0) {
            const physicalResource = physicalResources[0] as PhysicalResource;
                // remove it
                // if the key is space
                if (event.key === ' ') {
                    physicalResource.amount--;
                    resourceManager.addFromEnum(physicalResource.ResourceType, 1);
                    if (physicalResource.amount === 0) {
                        drawableManager.remove(physicalResource);
                    }
                }
        }
    }

    public static getInstance({gridPos} = {gridPos:null}): Person {
        if (!Person.instance) {
            Person.instance = new Person(gridPos);
        }
        return Person.instance;
    }

    draw(gridDrawer: GridDrawer): void {
        if(Loop.ticks % 70 === 0) {
            this.iconIndex = (this.iconIndex + 1) % this.iconList.length;
        }
        gridDrawer.drawImage(this.gridPos.x, this.gridPos.y, this.iconList[this.iconIndex]);
    }

    isOnGridPos(gridPos: { x: number; y: number; }): boolean {
        return this.gridPos.x === gridPos.x && this.gridPos.y === gridPos.y;
    }
}