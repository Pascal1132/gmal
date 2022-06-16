<template>
  <div>
    <Window v-for="window in windows" :key="window.id" v-bind="window">
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
    }
  },
  methods: {
    toggleMenu(state = null) {
      this.showMenu = state === null ? !this.showMenu : state
    },
  },
  mounted() {
    // add a base window
    this.$store.commit('openWindow', {
      id: 1,
      title: 'Base Window',
      content: '<div>Base Window</div>',
        top: 0,
        left: 0,
        size: {
            width: 400,
            height: 300,
        },

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
  computed: {
    windows(){
      return this.$store.state.windows
    },

  }
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
