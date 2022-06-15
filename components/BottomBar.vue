<template>
  <div>
    <div class="bottom-bar">
      <div>
        <icon class="toggle-menu" @click="toggleMenu()">
          <i class="fa-brands fa-windows"></i>
        </icon>
      </div>
      <div>
        <span class="clock noselect">
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
  computed: {
    currentTime() {
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
      return {
        time: strTime,
        date: year + '-' + month + '-' + day,
      }
    },
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

.bottom-bar icon {
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

.bottom-bar icon:hover {
  background: rgba(125, 125, 125, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(125, 125, 125, 0.18);
}

.bottom-bar icon:active i {
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

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 0;
  position: fixed;
  max-width: 500px;
  max-height: 500px;
  height: 70%;
  width: calc(100% - 20px);
  min-height: 300px;
  border-radius: 10px;
  background-color: rgba(34, 34, 34, 0.95);
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  bottom: 50px;
  transform: translateY(110%);
  margin: 10px;
  border: 1.5px solid rgba(125, 125, 125, 0.5);
  transition: all 0.2s ease-in-out;
}

.menu.show {
  transform: translateY(0);
}

.menu .search-bar {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 40px;
  background-color: rgba(29, 29, 29, 1);
  border: 1px solid rgba(125, 125, 125, 0.3);
  width: 100%;
  padding: 10px;
  border-radius: 3px;
  border-bottom: 2px solid rgb(165, 111, 165);
}

.menu-header {
  width: 100%;
  padding: 30px;
}

.menu .search-bar input,
.menu .search-bar .search-icon {
  border: none;
  background-color: rgba(29, 29, 29, 1);
  padding: 0;
  margin: 0;
  color: lightgrey;
  outline: none;
}

.menu .search-bar .search-icon i {
  transform: rotate(90deg);
}

.menu .search-bar input {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  color: lightgrey;
  background: none;
  padding: 0 20px;
  font-size: 14px;
}

.menu .menu-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  padding: 5px 20px;
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: rgba(32, 32, 32, 0.95);
  color: #f5f5f5;
  > * {
    cursor: pointer;
    border-radius: 5px;
    padding: 5px 10px;
    box-sizing: border-box;
    transition: all 0.1s ease-in-out;
    &:hover {
      background: rgba(125, 125, 125, 0.15);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
  }
  .login-user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
}
</style>
