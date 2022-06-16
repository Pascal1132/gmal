<template>
  <div
    ref="window"
    class="window"
    :style="{
      width: width + 'px',
      height: height + 'px',
      top: y + 'px',
      left: x + 'px',
    }"
    :class="{
      draggable: isDraggable,
      minimized: isMinimized,
    }"
  >
    <div class="window-header" @mousedown="setItCurrentDrag">
      <div class="window-title">
        <span>{{ title }}</span>
      </div>
      <div class="window-controls">
        <div class="window-controls-right">
          <div class="window-control" @click="minimize()">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <line
                x1="10"
                y1="50"
                x2="90"
                y2="50"
                stroke="white"
                stroke-width="7px"
              />
            </svg>
          </div>
          <div
            class="window-control fullscreen-toggle"
            @click="toggleFullScreen()"
          >
            <fa :icon="['far', 'square']" />
          </div>
          <div class="window-control close" @click="close()">
            <fa :icon="['fas', 'xmark']" />
          </div>
        </div>
      </div>
    </div>
    <div class="window-body">
      <div class="window-content">
        <slot></slot>
      </div>
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
            startClientDifferenceX: 0,
            startClientDifferenceY: 0,
            loaded: false,
            isFullScreen: false,
            lastX: 0,
            lastY: 0,
            lastWidth: 0,
            lastHeight: 0,
            height: 0,
            width: 0,
            zIndex: 1,
        }
    },
    props: {
        id: {
            type: Number,
            default: 0,
        },
        title: {
            type: String,
            default: 'Window 1',
        },
        content: {
            type: String,
            default: '<div>Window 1 content</div>',
        },
        size: {
            type: Object,
            default: {
                width: 400,
                height: 300,
            },
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
        if (!this.loaded){
            this.width = this.size.width
            this.height = this.size.height
        document.addEventListener('mouseup', this.onMouseUp);

        document.addEventListener('mousemove', this.onMouseMove);
        this.loaded = true;
        }
    },
    methods: {
        onMouseUp(e) {

            this.currentDrag = false;
        },
        setItCurrentDrag(e) {
            this.currentDrag = true;

            // get rectangle of window
            let rect = this.$refs.window.getBoundingClientRect();
            this.x = rect.left;
            this.y = rect.top;
            this.startClientDifferenceX = e.clientX - rect.left;
            this.startClientDifferenceY = e.clientY - rect.top;

        },
        onMouseMove(e) {
            if (this.currentDrag) {
                this.x =(e.clientX - this.startClientDifferenceX);
                this.y =(e.clientY - this.startClientDifferenceY);
            }
        },
        close() {
            console.log('close', this.id);
             this.$store.commit('closeWindow', this.id);
        },
        toggleFullScreen() {
            console.log('toggleFullScreen', this.id);
            this.$refs.window.classList.toggle('fullscreen');

            if (this.isFullScreen) {
                this.width = this.lastWidth;
                this.height = this.lastHeight;
                this.x = this.lastX;
                this.y = this.lastY;
            } else {
                this.lastX = this.x;
                this.lastY = this.y;
                this.lastWidth = this.width;
                this.lastHeight = this.height;
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.x = 0;
                this.y = 0;

            }
            this.isFullScreen = !this.isFullScreen;
        },
        minimize() {
            console.log('minimize', this.id);
            this.$store.commit('toggleMinimizeWindow', this.id);
            console.log(this.isMinimized);
        },

    }
}
</script>
<style lang="scss">
.window {
  position: absolute;
  background-color: $bg-color-light;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &.fullscreen {
    border-radius: 0;
    .window-header {
      border-radius: 0;
      .window-controls .window-controls-right .window-control:last-child {
        border-top-right-radius: 0;
      }
    }
  }
  &.focused {
    z-index: 400;
  }
  &.minimized {
    display: none;
  }
  // on screen mobile, force fullscreen
  @media (max-width: 768px) {
    width: 100% !important;
    height: 100% !important;
    border-radius: 0;
    .window-header {
      border-radius: 0;
      .window-controls .window-controls-right .window-control:last-child {
        border-top-right-radius: 0;
      }
      .fullscreen-toggle {
        display: none !important;
      }
    }
  }

  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px 5px 0 0;
    height: 40px;
    width: 100%;

    .window-title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      font-size: 13px;
      color: $txt-color;
    }
    .window-controls {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .window-controls-right {
        display: flex;
        height: 100%;
        padding: 0 0 5px 5px;

        align-items: center;
        justify-content: flex-start;
        .window-control {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 30px;
          border-radius: 0;
          background-color: transparent;
          color: lightgrey;
          transition: $btn-transition;
          cursor: pointer;
          &:hover {
            background-color: $hover-btn-color;
            &.close {
              background-color: $danger-color;
            }
          }
          svg {
            width: 10px;
            height: 100%;
            color: $txt-color;
          }
          &:last-child {
            border-top-right-radius: 5px;
          }
        }
      }
    }
  }
  .window-body {
    padding: 2px;
    cursor: e-resize;
    height: 100%;
    width: 100%;
    color: $txt-color;
    .window-content {
      height: 100%;
      width: 100%;
      overflow: auto;
      cursor: default;
    }
  }
}
</style>
