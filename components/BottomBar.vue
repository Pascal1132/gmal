<template>
  <div>
    <Calendar :show="showCalendar"></Calendar>
    <div class="bottom-bar">
      <div>
        <div class="toggle-menu" @click="toggleMenu()">
          <fa :icon="['fab', 'windows']" />
        </div>
      </div>
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
    }
  },
  mounted() {
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
  },
}
</script>
<style lang="scss">
.bottom-bar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
  background-color: rgba(34, 34, 34, 1);
  height: 50px;
}

.bottom-bar * {
  transition: all 0.2s cubic-bezier(0.02, 0.8, 0.34, 1.01);
}

.bottom-bar .toggle-menu {
  color: rgb(95, 211, 250);
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  padding: 5px 8px;
  min-width: 40px;
  margin: 5px;
  border: 1px solid rgba(255, 255, 255, 0);
  box-sizing: border-box;
}

.bottom-bar .toggle-menu:hover {
  background: rgba(125, 125, 125, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(125, 125, 125, 0.18);
}

.bottom-bar .toggle-menu:active svg {
  color: rgb(85, 158, 241);
  transform: scale(0.85);
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
