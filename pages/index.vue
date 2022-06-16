<template>
  <div>
    <Desktop></Desktop>
    <Menu :showMenu="showMenu" @toggle-menu="toggleMenu"></Menu>
    <BottomBar @toggle-menu="toggleMenu()"></BottomBar>
  </div>
</template>

<script lang="js">
export default {
  name: 'Index',
  data() {
    return {
      showMenu: false,
    }
  },
  methods: {
    toggleMenu(state = null) {
      this.showMenu =   state === null ? !this.showMenu : state
    },
  },
}
</script>
<style lang="scss">
.index {
  text-align: center;
}
</style>
