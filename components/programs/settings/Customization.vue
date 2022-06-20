<template>
  <div class="customization">

    <h2>Personnalisation</h2>
    <div class="theme-selector">
      <div class="current-bg">
        <div
          class="bg-preview"
          :style="{ backgroundImage: `${currentTheme.bg}` }"
        >
          <div class="over-bg">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
            <span class="line small"></span>
            <div class="button"></div>
          </div>
        </div>
      </div>
      <div class="theme-list">
        <div
          class="theme-preview"
          v-for="theme in themes"
          :key="theme.name"
          :style="{ backgroundImage: `${theme.bg}` }"
          :class="{ active: currentTheme.name == theme.name }"
          @click="changeTheme(theme)"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'customization',
    data() {
        return {
            themes: [
                {
                    name: 'blue',
                    bg: 'linear-gradient(to bottom right, #00bcd4, #0064a7)',
                    txt: '#fff',
                    interface: 'dark',
                    highlight: 'lightblue',
                    btn: '#fff',
                },
                {
                    name: 'gray',
                    bg: 'linear-gradient(to bottom right, #777, #444)',
                    txt: '#fff',
                    interface: 'dark',
                    highlight: 'lightgray',
                    btn: '#fff',
                },
                {
                    name: 'pink',
                    bg: 'linear-gradient(0deg, hsla(305, 100%, 22%, 1) 0%, hsla(346, 88%, 38%, 1) 100%)',
                    txt: '#000',
                    interface: 'light',
                    highlight: 'rgb(165, 111, 165)',
                    btn: '#000',
                },
                {
                    name: 'red',
                    bg: 'linear-gradient(to bottom right, #800, #400)',
                    txt: '#fff',
                    interface: 'dark',
                    highlight: 'indianred',
                    btn: '#fff',
                },
                {
                    name: 'black',
                    bg: 'linear-gradient(to top, #000, #333)',
                    txt: '#fff',
                    interface: 'dark',
                    highlight: '#fca311',
                    btn: '#fff',
                },
                {
                    name: 'orange',
                    bg: 'linear-gradient(109.6deg, rgb(255, 194, 48) 11.2%, rgb(255, 124, 0) 100.2%)',
                    txt: '#fff',
                    interface: 'light',
                    highlight: '#323031',
                    btn: '#fff',
                },
            ],
        }
    },
    methods: {
        changeTheme(theme) {
            this.$store.commit('settings/setTheme', theme);
        },
    },
    computed: {
        getCurrentThemeName() {
            return this.getCurrentTheme().name;
        },
        currentTheme() {
            return this.$store.state.settings.currentTheme;
        },
    }
}
</script>
<style lang="scss" scoped>
.customization {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .theme-selector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;

    .current-bg {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .bg-preview {
        width: 300px;
        height: 180px;
        border-radius: 6px;
        margin: 0;
        background: linear-gradient(to bottom right, #00bcd4, #0064a7);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        .over-bg {
          width: 70px;
          height: 75px;
          top: 80px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          left: 220px;
          flex-direction: column;
          background-color: $bg-color-1;
          border-radius: 4px;
          padding: 4px 10px;
          position: relative;
          .line {
            width: 100%;
            height: 1px;
            background-color: $txt-color;
            margin: 5px 0;
            top: 0;
            &.small {
              width: 50%;
            }
          }

          .button {
            width: 20px;
            height: 7px;
            background-color: $highlight-color;
            border-radius: 2px;
            align-self: flex-end;
            text-align: right;
            transform: translateX(12px);
            margin: auto;
          }
        }
      }
    }
    .theme-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      width: 350px;
      gap: 5px;
      flex-wrap: wrap;

      .theme-preview {
        width: 100px;
        height: 85px;
        border-radius: 6px;
        transition: filter 0.2s ease-in-out;
        &:hover {
          // filter brightness(0.8);
          filter: brightness(0.8);
        }
        &.active {
          border: 2px solid $txt-color;
        }
      }
    }
  }
}
</style>
