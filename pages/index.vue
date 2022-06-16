<template>
  <div>
    <Window v-for="(window, index) in windows" :key="index" v-bind="window">
      <div v-html="window.content"></div>
    </Window>
    <Desktop></Desktop>
    <Menu :showMenu="showMenu" @toggle-menu="toggleMenu"></Menu>
    <BottomBar @toggle-menu="toggleMenu()"></BottomBar>
  </div>
</template>

<script lang="js">
export default {
  name: 'Index',
  data() {
    return {
      showMenu: false,
      windows: []
    }
  },
  methods: {
    toggleMenu(state = null) {
      this.showMenu = state === null ? !this.showMenu : state
    },
  },
  mounted() {
    // add a base window
    this.windows.push({
      id: 1,
      title: 'Base Window',
      content: '<div>Base Window</div>',
        top: 0,
        left: 0,
        width: 300,
        height: 300,

      isMaximized: false,
      isMinimized: false,
      isActive: true,
      isDragged: false,
      isResized: false,
      isResizing: false,
      isDraggable: true,
      isResizable: true,
      isCloseable: true,
      isMaximizeable: true,
      isMinimizeable: true,
      isContextMenu: true,
      isContextMenuVisible: false,
      isContextMenuPositioned: false,
    });
  },
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
