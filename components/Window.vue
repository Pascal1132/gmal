<template>
  <div ref="window" class="window" :style="{width: width + 'px', height: height + 'px', top: x + 'px', left: y + 'px'}" :class="{draggable: isDraggable}">
    <div class="window-header" @mousedown="setItCurrentDrag">
      <div class="window-title">
        <span>{{ title }}</span>
      </div>
      <div class="window-controls">
        <div class="window-controls-left">
          <div class="window-controls-left-item">
            <fa :icon="['fas', 'window-maximize']" />
          </div>
          <div class="window-controls-left-item">
            <fa :icon="['fas', 'window-minimize']" />
          </div>
        </div>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'Window',
    data() {
        return {
            currentDrag: false,
            x: 0,
            y: 0,
        }
    },
    props: {
        title: {
            type: String,
            default: 'Window 1',
        },
        content: {
            type: String,
            default: '<div>Window 1 content</div>',
        },
        width: {
            type: Number,
            default: 300,
        },
        height: {
            type: Number,
            default: 300,
        },
        isMaximized: {
            type: Boolean,
            default: false,
        },
        isMinimized: {
            type: Boolean,
            default: false,
        },
        isDragged: {
            type: Boolean,
            default: false,
        },
        isResized: {
            type: Boolean,
            default: false,
        },
        isFocused: {
            type: Boolean,
            default: false,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        isDraggable: {
            type: Boolean,
            default: true,
        },
        isResizable: {
            type: Boolean,
            default: true,
        },
        isCloseable: {
            type: Boolean,
            default: true,
        },
        isMaximizeable: {
            type: Boolean,
            default: true,
        },
        isMinimizeable: {
            type: Boolean,
            default: true,
        },
        isContextMenu: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        // on mouse up
        document.addEventListener('mouseup', this.onMouseUp);

        document.addEventListener('mousemove', this.onMouseMove);
    },
    methods: {
        
        onMouseUp(e) {
            
            this.currentDrag = false;
        },
        setItCurrentDrag(e) {
            console.log('setItCurrentDrag');
            this.currentDrag = true;
        },
        onMouseMove(e) {
            if (this.currentDrag) {
                this.x = e.clientY
                this.y = e.clientX
            }
        },

    }
}
</script>
<style lang="scss">
.window {
  position: absolute;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>
