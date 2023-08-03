export class AResource {
    constructor(public name: string, public quantity = 0) {
    }
    draw(gridDrawer) {
    }
}

export enum ResourceType {
    Wood = "wood",
    Stone = "stone",
    Gold = "gold",
    Food = "food"
}

export class ResourceQuantity {
    wood: number;
    stone: number;
    gold: number;
    food: number;
    constructor(wood: number = 0, stone: number = 0, gold: number = 0, food: number = 0) {
        this.wood = wood;
        this.stone = stone;
        this.gold = gold;
        this.food = food;
    }

    clone(ResourceQuantity: ResourceQuantity) {
        this.wood = ResourceQuantity.wood;
        this.stone = ResourceQuantity.stone;
        this.gold = ResourceQuantity.gold;
        this.food = ResourceQuantity.food;
    }


    add(resourceQuantity: ResourceQuantity) {
        this.wood += resourceQuantity.wood;
        this.stone += resourceQuantity.stone;
        this.gold += resourceQuantity.gold;
        this.food += resourceQuantity.food;
    }

    substract(resourceQuantity: ResourceQuantity) {
        this.wood -= resourceQuantity.wood;
        this.stone -= resourceQuantity.stone;
        this.gold -= resourceQuantity.gold;
        this.food -= resourceQuantity.food;
    }

    isEnough(resourceQuantity: ResourceQuantity) {
        return this.wood >= resourceQuantity.wood &&
            this.stone >= resourceQuantity.stone &&
            this.gold >= resourceQuantity.gold &&
            this.food >= resourceQuantity.food;
    }
}
