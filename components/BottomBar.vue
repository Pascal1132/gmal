<template>
  <div>
    <Calendar :show="showCalendar"></Calendar>
    <div class="bottom-bar">
      <div class="left">
        <div class="toggle-menu icon" @click="toggleMenu()">
          <fa :icon="['fab', 'windows']" />
        </div>
        <div class="icon" @click="addTemplateWindow()">
          <img src="images/file_explorer.png" />
        </div>
        <div
          class="label"
          v-for="window in windows"
          :key="window.id"
          @click="onWindowClick(window.id)"
          :class="{ focused: activeWindowId == window.id }"
        >
          {{ window.title }}
        </div>
      </div>
      <div></div>
      <div>
        <span class="clock" @click="toggleCalendar()">
          <span id="current-time">{{ currentTime.time }}</span>
          <span id="current-date">{{ currentTime.date }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
  name: 'BottomBar',
  data() {
    return {
      currentTime: {
        time: '',
        date: '',
      },
      showCalendar: false,
      loaded: false,
    }
  },
  methods: {
    toggleMenu() {
      this.$emit('toggle-menu')
    },
    toggleCalendar() {
      this.showCalendar = !this.showCalendar
    },
    getTimeAndDate() {
var date = new Date()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      var day = date.getDate()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var year = date.getFullYear()
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      var strTime = hours + ':' + minutes
      this.currentTime = {
        time: strTime,
        date: year + '-' + month + '-' + day,
      }
    },
    addTemplateWindow() {
      // get a new id random
      var id = Math.floor(Math.random() * 100000000)

      this.$store.commit('openWindow', {
        id: id,
        title: 'Explorateur de fichier',
        component: 'ProgFileExplorer',
        size: {
          width: 800,
          height: 600,
        },
        pos: {
          x: window.innerWidth / 2 - 400,
          y: window.innerHeight / 2 - 300,
        },
      });
      this.$store.commit('setActiveWindow', id);
    },
    async onWindowClick(id){
      this.$store.commit('setActiveWindow', id);
    }
  },
  mounted() {
    if (!this.loaded){
       setInterval(() => {
      this.getTimeAndDate()
    }, 1000)
    this.getTimeAndDate();
    // on click outside, close the Calendar
        document.addEventListener('click', (e) => {
            if (this.showCalendar) {
                this.showCalendar = false;
            }
        });
        // prevent propagation
        this.$el.querySelector('.clock').addEventListener('click', (e) => {
            e.stopPropagation();
        });
      this.loaded = true
    }
  },
  computed: {
    windows(){
      return this.$store.state.windows;
    },
    activeWindowId(){
      return this.$store.state.activeWindow;
    },
  }
}
</script>
<style lang="scss">
.bottom-bar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background-color: rgba(34, 34, 34, 1);
  height: 50px;
  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    color: $txt-color;

    .separator {
      width: 1px;
      height: 20px;
      background-color: $txt-color;
      margin: 0 10px;
    }
    > div:not(.separator) {
      &.icon {
        color: rgb(95, 211, 250);
        font-size: 25px;
        padding: 5px 8px;
        min-width: 40px;
        flex-direction: column;
        img,
        svg {
          width: 22px;
          height: 22px;
        }
        &:active {
          svg,
          img {
            color: rgb(85, 158, 241);
            transform: scale(0.85);
          }
        }
      }
      &.label {
        font-size: 15px;
        padding: 5px 8px;
        min-width: 40px;
        flex-direction: column;
        //text overflow ellipsis
        white-space: nowrap;
        overflow: hidden;
        @media screen and (max-width: 768px) {
          font-size: 12px;
          max-width: 80px;
          text-align: left;
        }
        &:after {
          // add a small line below
          content: '';
          display: block;
          width: 5px;
          height: 3px;
          border-radius: 50px;
          background-color: $txt-color;
          margin-top: 3px;
          transition: all 0.3s ease-in-out;
        }
      }

      &.focused {
        // add a dot after the label
        &:after {
          width: 18px;
          background-color: $highlight-color;
        }
      }

      border-radius: 5px;
      display: inline-flex;
      justify-content: center;
      align-items: center;

      margin: 5px;
      border: 1px solid rgba(255, 255, 255, 0);
      box-sizing: border-box;
      &:hover {
        background: rgba(125, 125, 125, 0.15);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(125, 125, 125, 0.18);
      }
    }
  }
}


.bottom-bar .clock {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  font-size: 12px;
  height: calc(100% - 10px);
  padding: 5px 8px;
  min-width: 40px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0);
  box-sizing: border-box;
  color: white;
  margin: 5px;
}

.bottom-bar .clock:hover {
  background: rgba(125, 125, 125, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(125, 125, 125, 0.18);
}

.bottom-bar .clock:active {
  color: lightgrey;
}
</style>
