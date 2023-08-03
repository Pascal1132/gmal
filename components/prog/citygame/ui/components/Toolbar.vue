<template>
    <div class="toolbar">
        <div class="toolbar-resources">
            <div class="toolbar-resource" v-for="resource in resources" :key="resource.name">
                <!-- <img :src="resource.icon"/> -->
                <span>{{resource.name}}</span>
                <span>{{resource.quantity}}</span>
            </div>
        </div>
        <div class="toolbar-itme">
            <div class="toolbar-item" :class="{selected: selected === item.entityClass}" v-for="item in items" :key="item.name" @click="onItemClicked(item)">
            <!-- <img :src="item.icon" :class="{selected: selected === item.entityClass}"/> -->
            <!-- Temporary use the first letter of the name -->
            <span>
                {{item.name[0]}}
            </span>
        </div>
        </div>
        
    </div>

</template>
<script lang="ts">
import ResourceManager from '../../core/application/ResourceManager';
import toolbarManager from '../../core/application/ToolbarManager';
import { Cottage } from '../../core/domain/entities/Cottage';
import { GridPos } from '../../core/domain/value_objects/GridPos';
import { ResourceQuantity } from '../../core/domain/value_objects/Resources';

export default {
    name: 'Toolbar',
    data() {
        return {
            items: [
                /*{
                    name: 'Cottage',
                    icon: 'images/programs/citygame/cottage.png',
                    entityClass: Cottage,
                }*/
            ],
            selected: null,
            resourceQuantities: new ResourceQuantity(),
        }
    },
    props: {
    },
    methods: {
        onItemClicked(item: { name: string; icon: string; entityClass: any}) {
            if (this.selected === item.entityClass)
                toolbarManager.setSelectedToolClass(null);
            else
                toolbarManager.setSelectedToolClass(item.entityClass);
        }
    },
    mounted() {
        toolbarManager.attach((selected = null)=>{
            this.selected = selected;
        });
        ResourceManager.attach((resources: ResourceQuantity)=>{
            this.resourceQuantities.clone(resources);
        });
    },
    computed: {
        resources() {
            return [
                {
                    name: 'Wood',
                    quantity: this.resourceQuantities.wood,
                    icon: 'images/programs/citygame/wood.png',
                },
                {
                    name: 'Stone',
                    quantity: this.resourceQuantities.stone,
                    icon: 'images/programs/citygame/stone.png',
                },
                {
                    name: 'Gold',
                    quantity: this.resourceQuantities.gold,
                    icon: 'images/programs/citygame/gold.png',
                },
                {
                    name: 'Food',
                    quantity: this.resourceQuantities.food,
                    icon: 'images/programs/citygame/food.png',
                },
            ]
        }
    },
    watch: {
        // resource quantites with deep and immediate
        resourceQuantities: {
            handler: function (val: ResourceQuantity) {
                this.resourceQuantities = val;
            },
            deep: true,
            immediate: true,
        }
    }
}
</script>

<style lang="scss" scoped>

.toolbar {
    display: flex;
    margin-top: 5px;
    flex-direction: row;
    width: 100%;
    background-color: #333;
    border-bottom: 1px solid #000;

    .toolbar-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 50px;
        cursor: pointer;

        img {
            height: 30px;
            width: 30px;
        }

        &.selected {
            background-color: #db5252;
        }
    }

    .toolbar-resources {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;

        border-right: 1px solid #000;
        border-left: 1px solid #000;

        .toolbar-resource {
            display: flex;
            flex-direction: row;
            width: 100px;
            justify-content: space-between;
            align-items: center;
            > span {
                margin: 0 5px;
            }
            img {
                height: 30px;
                width: 30px;
            }
        }
    }
}
</style>