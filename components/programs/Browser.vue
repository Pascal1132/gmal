<template>
  <div class="browser">
    <header></header>
    <div class="content">
      <div class="content-nav">
        <input
          type="search"
          class="search-input"
          placeholder="Rechercher"
          v-model="searchLink"
        />
        <button type="button">
          <fa :icon="['fas', 'magnifying-glass']" />
        </button>
      </div>
      <div class="content-body">
        <iframe :src="searchLink" id="iframe-content" ref="iframe"></iframe>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'Browser',
    data() {
        return {
            searchLink: 'https://bing.com/',
        }
    },
    props: {
        windowKey: {
            type: Number,
            default: 0,
        },
    },
    methods: {
    },
    mounted() {
        this.$store.commit('windows/setWindow', {
            id: this.windowKey,
            title: 'Chrome',
            isMinimized: false,
         pos:{
            // center the window
            x: window.innerWidth / 2 - 300,
            y: window.innerHeight / 2 - 300,
         },
          size: {
              width: 700,
              height: 500,
              minWidth: 400,
              minHeight: 400,
          },
          iconPath: 'images/chrome.png',
        });
        // on target _blank links event
        
        // on change page in iframe
        document.getElementById('iframe-content').addEventListener('load', (e) => {
            console.log('load', this.$refs.iframe.contentWindow.location.href);
        });
    },
    watch: {
        searchLink(newValue) {
          console.log('searchLink', newValue);
            this.$store.commit('windows/setWindow', {
                id: this.windowKey,
                title: newValue,
            });
        },
    },
}
</script>
<style lang="scss" scoped>
.browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  /*header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 50px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }*/
  .content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .content-nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      height: 40px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;

      input {
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
        color: #000;
        font-size: 14px;
        padding: 0 10px;
        outline: none;
      }
      button {
        padding: 7px 9px;
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        background-color: transparent;
        border: none;
        color: #000;
        justify-content: center;
        border-radius: 5px;
        transition: $btn-transition;
        &:hover {
          background-color: #e0e0e0;
        }
      }
    }
    .content-body {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      iframe {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        border: none;
      }
    }
  }
}
</style>
