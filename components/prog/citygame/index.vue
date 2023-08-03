<template>
    <div>
    <GameGrid/>
    <Toolbar />
</div>
</template>

<script>
import drawableManager from './core/application/DrawableManager';
import EventManager from './core/application/EventManager';
import { Cottage } from './core/domain/entities/Cottage';
import { Person } from './core/domain/entities/Person';
import { GridPos } from './core/domain/value_objects/GridPos';
import GameGrid from './ui/components/GameGrid.vue';
import Toolbar from './ui/components/Toolbar.vue';

export default {
    name: 'CityGameIndex',
    components: {
    GameGrid,
    Toolbar
},
    data() {
        return {
            isInitialized: false,
        }
    },
    methods: {
        keyDown(e) {
            EventManager.getInstance().dispatchEvent('keydown', e);
        },
        keyUp(e) {
            EventManager.getInstance().dispatchEvent('keyup', e);
        },
        keyPress(e) {
            EventManager.getInstance().dispatchEvent('keypress', e);
        }
    },
    mounted() {
        if (!this.isInitialized) {
            document.addEventListener('keydown', this.keyDown);
            document.addEventListener('keyup', this.keyUp);
            document.addEventListener('keypress', this.keyPress);
            this.isInitialized = true;
        }
        drawableManager.init();
        
    },

    beforeDestroy() {
        document.removeEventListener('keydown', this.keyDown);
        document.removeEventListener('keyup', this.keyUp);
        document.removeEventListener('keypress', this.keyPress);
    }
}
</script>