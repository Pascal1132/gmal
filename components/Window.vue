<template>
  <div ref="window" class="window" :style="{
    width: width + 'px',
    height: height + 'px',
    top: y + 'px',
    left: x + 'px',
    // CSS variables
    '--window-width': width + 'px',
    '--window-height': height + 'px',
    '--window-x': x + 'px',
    '--window-y': y + 'px',
  }" :class="{
  draggable: isDraggable,
  minimized: isMinimized,
  willMinimize: willMinimize,
  focused: isFocused,
  isLoaded,
}" @click="onWindowClick">
    <div class="window-header" @mousedown="setItCurrentDrag" @dblclick="toggleFullScreen">
      <div class="window-title">
        <img v-if="iconPath" :src="iconPath" class="window-favicon" />
        <span>{{ title }}</span>
      </div>
      <div class="window-controls">
        <div class="window-controls-right">
          <div class="window-control" @click="minimize">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="7px" />
            </svg>
          </div>
          <div class="window-control fullscreen-toggle" @click="toggleFullScreen">
            <fa :icon="['far', 'square']" />
          </div>
          <div class="window-control close" @click="close">
            <fa :icon="['fas', 'xmark']" />
          </div>
        </div>
      </div>
    </div>
    <div class="window-body" @mousedown="resizeStart">
      <div class="window-content">
        <slot :isSmall="isSmall" :isMedium="isMedium"></slot>
      </div>
    </div>
    <div class="window-footer" @mousedown="resizeStart"></div>
  </div>
</template>
<script lang="js">
import { mapActions } from 'pinia';

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
      // Resize the width from the right side
      resizingWR: false,
      // Resize the height from the bottom
      resizingHB: false,
      // Resize the width from the left side
      resizingWL: false,
      // Resize the height from the top
      resizingHT: false,

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
      default: () => ({
        x: 0,
        y: 0,
      }),
    },
    iconPath: {
      type: String,
      default: '',
    },
    isMinimized: {
      type: Boolean,
      default: false,
    },
    isFocused: {
      type: Boolean,
      default: false,
    },
    isDraggable: {
      type: Boolean,
      default: true,
    },
    isLoaded: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // on mouse up
    if (!this.loaded) {
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

  methods: {
    ...mapActions(useWindowsStore, ['closeWindow']),
    onMouseUp(e) {
      this.currentDrag = false;
      if (this.resizingHB || this.resizingWR) {
        if (this.resizingHB && this.resizingWR ||
          this.resizingHB && this.resizingWL
        ) {
          // set mouse cursor has default
          document.body.style.cursor = 'default';
        }
        this.resizingHB = false;
        this.resizingWR = false;
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
        let y = (e.clientY - this.startClientDifferenceY);
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
      if (this.resizingWR && (e.clientX - this.x) > this.size.minWidth) {
        this.width = e.clientX - this.x;
      }
      if (this.resizingHB && (e.clientY - this.y) > this.size.minHeight) {
        this.height = e.clientY - this.y;
      }


      if (this.resizingHB && (e.clientY - this.y) > this.size.minHeight) {
        this.height = e.clientY - this.y;
      }
    },
    close(e) {
      e.stopPropagation();
      this.closeWindow(this.id);
      this.$emit('closed-window', this.id);
    },
    toggleFullScreen(e) {
      if (e) {
        e.stopPropagation();
      }
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
    minimize(e) {
      e.stopPropagation();
      e.preventDefault();
      this.willMinimize = true;
      this.setMinimized(this.id, true);
    },
    resizeStart(e) {
      // if the mouse is at the right edge of the window
      this.resizingWR = (e.clientX > this.x + this.width - 10);
      // if the mouse is at the left edge of the window
      this.resizingWL = (e.clientX < this.x + 10);


      // if the mouse is at the bottom edge of the window
      this.resizingHB = (e.clientY > this.y + this.height - 10);
      // if the mouse is at the top edge of the window
      //this.resizingHT = (e.clientY < this.y + 10);

      if (this.resizingHB && this.resizingWR) {
        // set mouse cursor has resize
        document.body.style.cursor = 'nwse-resize';
      } else if (this.resizingHB && this.resizingWL) {
        // set mouse cursor has resize
        document.body.style.cursor = 'nesw-resize';
      } else if (this.resizingHT && this.resizingWR) {
        // set mouse cursor has resize
        document.body.style.cursor = 'nesw-resize';
      } else if (this.resizingHT && this.resizingWL) {
        // set mouse cursor has resize
        document.body.style.cursor = 'nwse-resize';
      }

      //this.resizing = true;
    },
    onWindowClick(e) {
      this.setActiveWindow(this.id);
    },
    ...mapActions(useWindowsStore, ['setMinimized', 'setWindow', 'setActiveWindow']),

  },
  computed: {
    isSmall() {
      return this.width < 600 || window.innerWidth < 600
    },
    isMedium() {
      return this.width < 800 || window.innerWidth < 800
    },
  }
}
</script>
<style lang="scss">
.window {
  position: absolute;
  background-color: $bg-color-1;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: none;
  min-width: 300px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &.isLoaded {
    animation: windowEnter 0.2s ease-in-out;
    display: flex;

  }

  &.transition {
    transition: all 0.2s ease-in-out;
  }

  &.fullscreen {
    height: $height-no-bottom-nav !important;
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
    &,
    &.fullscreen {
      width: 100% !important;
      height: 100% !important;
      position: absolute;
      top: 0 !important;
      left: 0 !important;
      z-index: 300;
      border-radius: 0;

      .window-header {
        border-radius: 0;

        .window-controls .window-controls-right .window-control:last-child {
          border-top-right-radius: 0 !important;
        }

        .fullscreen-toggle {
          display: none !important;
        }
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
        background-color: $bg-color-1;
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
    height: calc(100% - 40px);
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

@keyframes windowEnter {
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
