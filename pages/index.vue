<template>
  <main class="theme-definer" :class="[currentTheme.interface]" :style="generateStyleFromTheme">
    <GmalLoader :loading="!initialized" />
    <div>
      <Notifications />
      <Window v-for="window in windows" :key="window.id" v-bind="window" :isFocused="activeWindowId == window.id"
        :isMinimized="window.isMinimized" v-slot="slotProps">
        <Component :is="resolveComponent(window.component)" :windowKey="window.id"
          v-bind="{ ...window.params, ...slotProps }" @set-window-frame="(data) => setWindowFrame(data, window.component)"></Component>
      </Window>

      <Desktop></Desktop>
      <Menu :showMenu="showMenu" @toggle-menu="toggleMenu"></Menu>
      <BottomBar @toggle-menu="toggleMenu()"></BottomBar>
    </div>
  </main>
</template>

<script lang="js">
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useThemeStore } from '../store/theme'
import { useWindowsStore } from '../store/windows'

export default {
  setup() {
    const { getWindows, getActiveWindowId, closeWindow } = useWindowsStore();
    return {
      getWindows,
      getActiveWindowId,
      closeWindow,
    }
  },
  head() {
    return {
      title: 'G-mal',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'G-mal, un outil qui sert pas à grand chose !',
        },
      ],
    };
  },
  data() {
    return {
      showMenu: false,
    }
  },
  methods: {
    toggleMenu(state = null) {
      this.showMenu = state === null ? !this.showMenu : state
    },
    setWindowFrame(data, component) {
      if (data?.isSingleInstance === true) {
        const window = this.windows.find(w => w.component === component && w.isLoaded === true);
        if (window) {
          this.closeWindow(data.id);
          this.$nextTick(() => {
            this.setActiveWindow(window.id);
          });
          return;
        }
      }
      data.isLoaded = true;
      this.setWindow(data.id, data);
    },
    ...mapActions(useWindowsStore, ['setWindow', 'setActiveWindow']),
  },
  computed: {
    generateStyleFromTheme() {
      return {
        '--highlight-color': this.currentTheme.highlight,
      };
    },
    ...mapWritableState(useThemeStore, ['currentTheme']),
    ...mapWritableState(useWindowsStore, ['windows', 'activeWindowId']),
    ...mapState(useInitializerStore, ['initialized']),
  },
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
