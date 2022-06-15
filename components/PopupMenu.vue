<template>
    <div class="popup-menu" :class="{show: showMenu}" :style="{
        top: pos.top + 'px',
        left: pos.left + 'px',
    }">
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
                top: 0,
                left: 0,
            },
        },
    },
}
</script>
<style lang="scss" scoped>
.popup-menu {
  display: none;
  position: absolute;
  padding: 5px;
  color: #f5f5f5;
  background-color: rgba(34, 34, 34, 0.95);
  border-radius: 6px;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);
  min-width: 100px;
  font-size: 13px;
  z-index: 44;
  transition: all 0.2s ease-in-out;
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
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease-in-out;
      &:last-child {
        border-bottom: none;
      }
      &:hover{
        background: rgba(125, 125, 125, 0.15);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
    }
  }
}
</style>