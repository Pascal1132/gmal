import { ResourceQuantity, ResourceType } from "../domain/value_objects/Resources";

// singleton class with a ResourceQuantity
class ResourceManager {
    private resources: ResourceQuantity;
    private life: number // On 10
    private observers: CallableFunction[] = [];

    constructor() {
        this.resources = new ResourceQuantity(0, 0, 0, 0);
    }

    attach(observer: CallableFunction) {
        this.observers.push(observer);
    }

    detach(observer: CallableFunction) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    add(resourceQuantity: ResourceQuantity) {
        this.resources.add(resourceQuantity);
        this.notify();
    }

    addFromEnum(resourceType: ResourceType, quantity: number) {
        this.resources[resourceType] += quantity;
        this.notify();
    }

    decrementLife(amount:number){
        this.life -= amount;
    }

    notify() {
        this.observers.forEach(o => o(this.resources));
    }
}

const resourceManager = new ResourceManager();

export default resourceManager;