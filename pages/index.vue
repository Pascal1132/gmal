<template>
  <div class="theme-definer" :class="[currentTheme.interface]" :style="generateStyleFromTheme">
    <LazyWindow v-for="window in windows" :key="window.id" v-bind="window" :isFocused="activeWindowId == window.id" :isMinimized="window.isMinimized" v-slot="slotProps">
      <LazyComponent :is="window.component" :windowKey="window.id" v-bind="{...window.params, ...slotProps}" ></LazyComponent>
    </LazyWindow>
    <Desktop></Desktop>
    <LazyMenu :showMenu="showMenu" @toggle-menu="toggleMenu"></LazyMenu>
    <BottomBar @toggle-menu="toggleMenu()"></BottomBar>
  </div>
</template>

<script lang="js">
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
  data() {
    return {
      showMenu: false,
    }
  },
  middleware: ['store-populate'],
  async asyncData(){
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
      return this.$store.state.windows.windows
    },
    activeWindowId(){
      return this.$store.state.windows.activeWindow;
    },
    ...mapGetters({
      currentTheme: 'settings/currentTheme',
    }),
    generateStyleFromTheme() {
      return {
        '--highlight-color': this.currentTheme.highlight,
      };
    }
  }
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
