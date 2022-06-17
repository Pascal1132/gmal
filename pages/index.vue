<template>
  <div>
    <LazyWindow v-for="window in windows" :key="window.id" v-bind="window" :isFocused="activeWindowId == window.id" :isMinimized="window.isMinimized">
      <LazyComponent :is="window.component" :windowKey="window.id"></LazyComponent>
    </LazyWindow>
    <Desktop></Desktop>
    <LazyMenu :showMenu="showMenu" @toggle-menu="toggleMenu"></LazyMenu>
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
