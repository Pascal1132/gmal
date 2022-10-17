<template>
  <div class="theme-definer" :class="[currentTheme.interface]" :style="generateStyleFromTheme">
    <Window v-for="window in windows" :key="window.id" v-bind="window" :isFocused="activeWindowId == window.id" :isMinimized="window.isMinimized" v-slot="slotProps"  >
      <Component :is="resolveComponent(window.component)" :windowKey="window.id" v-bind="{...window.params, ...slotProps}" @set-window-frame="setWindowFrame" ></Component>
    </Window>

    <Desktop></Desktop>
    <Menu :showMenu="showMenu" @toggle-menu="toggleMenu"></Menu>
    <BottomBar @toggle-menu="toggleMenu()"></BottomBar>
  </div>
</template>

<script lang="js">
import { mapActions, mapState } from 'pinia';
import { useThemeStore } from '../store/theme'
import { useWindowsStore } from '../store/windows'


export default {
  setup() {
    const {getWindows, getActiveWindowId} = useWindowsStore();
    return {
      getWindows,
      getActiveWindowId,
    }
  },
  data() {
    return {
      showMenu: false,
    }
  },
  //middleware: ['store-populate'],
  async asyncData(){
    return {
      showMenu: false,
    }
  },
  methods: {
    toggleMenu(state = null) {
      this.showMenu = state === null ? !this.showMenu : state
    },
    setWindowFrame(data) {
      this.setWindow(data.id, data);
    },
    ...mapActions(useWindowsStore, ['setWindow']),
  },
  mounted() {
  },
  computed: {
    generateStyleFromTheme() {
      return {
        '--highlight-color': this.currentTheme.highlight,
      };
    },
    ...mapState(useThemeStore, ['currentTheme']),
    ...mapState(useWindowsStore, ['windows', 'activeWindowId']),
  },
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
