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
      willMinimize: willMinimize,
      focused: isFocused,
    }"
    @click="onWindowClick"
  >
    <div class="window-header" @mousedown="setItCurrentDrag" @dblclick="toggleFullScreen">
      <div class="window-title">
        <img v-if="iconPath" :src="iconPath" class="window-favicon"/>
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
    <div class="window-body" @mousedown="resizeStart">
      <div class="window-content">
        <slot></slot>
      </div>
    </div>
    <div class="window-footer" @mousedown="resizeStart"></div>
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
            minWidth: 200,
            minHeight: 200,
            zIndex: 1,
            resizingW: false,
            resizingH: false,
            willMinimize: false,
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
            default: () => ({
                width: 200,
                height: 200,
                minWidth: 200,
                minHeight: 100,
            }),
        },
        pos: {
            type: Object,
            default: ()=>({
                x: 0,
                y: 0,
            }),
        },
        iconPath: {
            type: String,
            default: '',
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
    // watch size changes
    watch: {
        size: {
            handler(val) {
                this.width = val.width
                this.height = val.height
                this.minWidth = val.minWidth
                this.minHeight = val.minHeight
            },
            deep: true,
        },
        pos: {
            handler(val) {
                this.x = val.x
                this.y = val.y
            },
            deep: true,
        },

    },

    methods: {
        onMouseUp(e) {

            this.currentDrag = false;
            if (this.resizingH || this.resizingW) {
                if (this.resizingH && this.resizingW) {
                // set mouse cursor has default
                document.body.style.cursor = 'default';
            }
                this.resizingH = false;
                this.resizingW = false;


            }
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
                let x = (e.clientX - this.startClientDifferenceX);
                let y =(e.clientY - this.startClientDifferenceY);
                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                if (x > window.innerWidth - this.width) {
                    x = window.innerWidth - this.width;
                }
                if (y > window.innerHeight - 85) {
                    y = window.innerHeight - 85;
                }
                this.x = x;
                this.y = y;
                // if is fullscreen than, disable fullscreen
                if (this.isFullScreen) {
                    this.toggleFullScreen();
                    // startClientDifferenceX half of window width
                    this.startClientDifferenceX = this.width / 2;
                    this.startClientDifferenceY = 5;
                }

            }
            if(this.resizingW && (e.clientX - this.x) > this.size.minWidth) {
                this.width = e.clientX - this.x;
            }
            if(this.resizingH && (e.clientY - this.y) > this.size.minHeight) {
                this.height = e.clientY - this.y;
            }
        },
        close() {
            console.log('close', this.id);
             this.$store.commit('windows/closeWindow', this.id);
        },
        toggleFullScreen() {
            console.log('toggleFullScreen', this.id);
            this.$refs.window.classList.toggle('fullscreen');
            // add transition class
            this.$refs.window.classList.add('transition');

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

            // remove transition class
            setTimeout(() => {
                this.$refs.window.classList.remove('transition');
            }, 200);
            this.isFullScreen = !this.isFullScreen;
        },
        minimize() {
            this.willMinimize = true;
            console.log('minimize', this.id);
            this.$store.commit('windows/minimizeWindow', this.id);
        },
        resizeStart(e) {
            // if the mouse is at the right edge of the window
            if (e.clientX > this.x + this.width - 10) {
                this.resizingW = true;
            }
            // if the mouse is at the left edge of the window
            if (e.clientX < this.x + 10) {
                this.resizingW = true;
            }
            // if the mouse is at the bottom edge of the window
            if (e.clientY > this.y + this.height - 10) {
                this.resizingH = true;
            }

            if (this.resizingH && this.resizingW) {
                // set mouse cursor has resize
                document.body.style.cursor = 'nwse-resize';
            }

            //this.resizing = true;
        },
        onWindowClick(e) {
            if (!this.willMinimize){
                this.$store.commit('windows/setActiveWindow', this.id);
                this.willMinimize = false;
            } 
        },
    },
    // on isMinimized change
    watch: {
        isMinimized: {
            handler(val) {
                if (val) {
                    setTimeout(() => {
                        this.willMinimize = false;
                    }, 500);
                }
            },
            deep: true,
        },
    },
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
  min-width: 300px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  animation: fadeIn 0.2s ease-in-out;
  &.transition {
    transition: all 0.2s ease-in-out;
  }

  &.fullscreen {
    height: $height-no-bottom-nav!important;
    border-radius: 0;
    .window-header {
      border-radius: 0;
      .window-controls .window-controls-right .window-control:last-child {
        border-top-right-radius: 0;
      }
    }
  }
  &.focused {
    z-index: 3;
  }
  &.minimized {
    animation: minimizeAnimation 0.2s ease-in-out;
    opacity: 0;
    &:not(.willMinimize) {
      display: none;
    }
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
      .window-favicon {
        width: auto;
        height: 15px;
        margin-right: 5px;
        background-color: $bg-color-light;
      }
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
    padding: 0 4px 0 3px;
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
  .window-footer {
    width: 100%;
    height: 4px;
    cursor: s-resize;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(100px);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes minimizeAnimation {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.8) translateY(100px);
  }
}
</style>
