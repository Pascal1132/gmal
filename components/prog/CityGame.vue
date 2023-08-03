<template>
  <div class="city-game">
    <ProgCityGameIndex />
  </div>
</template>
<script lang="ts">
import index from './citygame/index.vue';
export default {
  name: 'CityGame',
  data() {
    return {
    }
  },
  props: {
    windowKey: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    start() {
    },
  },
  mounted() {
    this.$emit('set-window-frame', {
      id: this.windowKey,
      title: 'City Game',
      isMinimized: false,
      size: {
        width: 700,
        height: 700,
      },
      iconPath: 'images/programs/citygame/logo.jpeg',
    });
  },
  components: {
    ProgCityGameIndex: index,
  },
}
</script>
<style lang="scss" scoped>
.city-game {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  }
</style>
