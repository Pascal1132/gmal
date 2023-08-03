import { Cottage } from "../domain/entities/Cottage";
import drawableManager from "./DrawableManager";

class ToolbarManager{
    private selectedToolClass: any | null = null;
    private observers: CallableFunction[] = [];
    
    attach(observer: CallableFunction) {
        this.observers.push(observer);
    }

    detach(observer: CallableFunction) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    isSelecting(){
        return this.selectedToolClass !== null;
    }

    setSelectedToolClass(selectedToolClass: any){
        this.selectedToolClass = selectedToolClass;
        this.observers.forEach(o => o(this.selectedToolClass));
    }

    addCurrentToDrawable(x: any, y: any){
        if(this.selectedToolClass !== null){
            if (drawableManager.isOccupied({x, y})) {
                return;
            }
            drawableManager.add(new this.selectedToolClass({x, y}));
            this.selectedToolClass = null;
            this.observers.forEach(o => o(this.selectedToolClass));
        }
    }
        
}

const toolbarManager = new ToolbarManager();

export default toolbarManager;