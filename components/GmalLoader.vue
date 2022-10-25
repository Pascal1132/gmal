<template>
    <div v-if="!loaded" id="loader" :class="{ willHide: willHide }">
        <!-- Add a windows icon -->
            <fa class="loader-icon" :icon="['fab', 'windows']" />

    </div>
</template>
<script lang="js">
export default {
    name: 'GmalLoader',
    props: {
        loading: {
            required: true,
            type: Boolean,
        }
    },
    data() {
        return {
            willHide: false,
            loaded: false,
        }
    },
    // on change of loading, add class willHide to loader
    watch: {
        loading: function (val) {
            if (!val) {
                this.willHide = true;
                // after 1s, set loaded to true
                setTimeout(() => {
                    this.loaded = true;
                }, 500);
            }
        }
    },
}
</script>
<style lang="scss">
#loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(50, 50, 50);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: 700;
    color: lightblue;

    transition: opacity .5s ease, transform .25s ease-in-out, color 0.5s ease-in-out, background-color 0.5s ease-in-out;

    &.willHide {
        opacity: 0;
    }

    .loader-icon {
        width: 15vw;
        height: 15vw;
        
        animation: changeColor 2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes changeColor {
        0% {
            color: lightblue;
        }
        100% {
            color: lightseagreen;
        }
    }
}
</style>