<template>
  <div class="popup-menu" :class="{ show: showMenu }" :style="menuStyle">
    <slot></slot>
  </div>
</template>
<script lang="js">
export default {
  name: 'PopupMenu',
  props: {
    showMenu: {
      type: Boolean,
      default: false,
    },
    pos: {
      type: Object,
      default: {
        top: null,
        left: null,
        right: null,
        bottom: null,
      },
    },
    customStyle: {
      type: Object,
      default: {},
    },
  },
  computed: {
    menuStyle() {
      return {
        ...this.customStyle,
        top: (this.pos.top !== null) ? `${this.pos.top}px` : null,
        left: (this.pos.left !== null) ? `${this.pos.left}px` : null,
        right: (this.pos.right !== null) ? `${this.pos.right}px` : null,
        bottom: (this.pos.bottom !== null) ? `${this.pos.bottom}px` : null,
      };
    },
  }
}
</script>
<style lang="scss">
.popup-menu {
  display: none;
  position: absolute;
  padding: 5px;
  color: $txt-color;
  background-color: rgba($hex-bg-color-2, 0.8);
  border-radius: 6px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
  // blur filter
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  min-width: 100px;
  font-size: 13px;
  z-index: 101;

  &.show {
    display: flex;
  }

  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;

    li {
      width: 100%;
      display: flex;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      white-space: nowrap;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease-in-out;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(125, 125, 125, 0.15);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
    }
  }
}
</style>
