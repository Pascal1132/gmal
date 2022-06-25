<template>
  <div class="container">
    <div class="header">
      <button @click="start()">Start</button>
    </div>
    <div class="body">
      </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'TwoZeroFourEight',
    components: {
        
    },
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
            this.$refs.game.start();
        },

    },
    mounted() {
        this.$store.commit('windows/setWindow', {
            id: this.windowKey,
            title: '2 miles et 40 huitres',
            size: {
                width: 700,
                height: 500,
                minWidth: 500,
                minHeight: 400,
            },
            iconPath: 'images/2048.png',
        });
    },
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 10px;
  overflow: auto;

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    gap: 10px;
    padding: 0 10px;
    button {
      width: 100px;
      height: 30px;
      border-radius: $border-radius-sm;
      border-color: $border-color;
      background-color: $bg-color-0;
      color: $txt-color;
      font-size: 1rem;
      transition: $transition;
      cursor: pointer;
      &:hover {
        color: $highlight-color;
      }
    }
    input {
      width: 50px;
      height: 30px;
      border-radius: $border-radius-sm;
      border-color: $border-color;
      background-color: $bg-color-0;
      color: $txt-color;
      font-size: 1rem;
      transition: $transition;
      &:hover {
        color: $highlight-color;
      }
    }
  }

  .body {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    overflow: auto;
    height: calc(100% - 100px);
    gap: 10px;
  }
}
</style>
