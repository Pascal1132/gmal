<template>
  <div>
    <Window v-for="window in windows" :key="window.id" v-bind="window" :isFocused="activeWindowId == window.id">
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
  },
  computed: {
    windows(){
      return this.$store.state.windows
    },
    activeWindowId(){
      return this.$store.state.activeWindow;
    },
  }
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
