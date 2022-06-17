<template>
  <div>
    <PopupMenu ref="popup-menu" :showMenu="showPopup" :pos="popupPosition">
      <ul>
        <li class="close-tab-toggle" @click="togglePopup()">
          <fa :icon="['fas', 'arrow-right-from-bracket']" />
          <span>Déconnexion</span>
        </li>
      </ul>
    </PopupMenu>
    <div ref="menu" class="menu" :class="{ show: showMenu }">
      <div class="menu-header">
        <div class="search-bar">
          <span class="search-icon">
            <fa :icon="['fas', 'magnifying-glass']" />
          </span>
          <input
            type="search"
            placeholder="Taper ici pour effectuer une recherche"
          />
        </div>
      </div>
      <div></div>
      <div class="menu-footer">
        <div class="login-user">
          <img src="images/person.png" />
          <span>Utilisateur de G-Mal</span>
        </div>
        <div class="shutdown-btn" @click="togglePopup">
          <fa :icon="['fas', 'power-off']" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
  name: 'Menu',
    props: {
        showMenu: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showPopup: false,
            popupPosition: {
                top: 0,
                left: 0,
            },
            loaded: false,
        }
    },
    methods: {
        togglePopup(e) {
            this.showPopup = !this.showPopup;
            if (e) {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                let posX = rect.left - 50;
                // if it is a mobile device than subtract the height of the header
                if (window.innerWidth < 768) {
                    posX = rect.left - 70;
                }
                const posY = rect.top - 45;
                this.popupPosition = {
                    top: posY,
                    left: posX,
                }
            }
        },
    },
    mounted() {
      if (!this.loaded){
    // on click outside of the menu
    document.addEventListener('click', (e) => {
        if (this.showPopup) {
            this.showPopup = false;
        } else if (!this.$el.contains(e.target) && this.showMenu) {
                this.$emit('toggle-menu', false);
            }


    });
    // prevent propagation of click event
    this.$el.addEventListener('click', (e) => {
      e.stopPropagation()
    });
    // prevent propagation on .toggle-menu
    document.querySelector('.toggle-menu').addEventListener('click', (e) => {
      e.stopPropagation();
    });
    this.loaded = true;
      }
  },
  // watch showMenu if is true, than focus the search-bar input
  watch: {
    showMenu(val) {
      if (val) {
        this.$refs.menu.querySelector('.search-bar input').focus();
      }
    },
  },
}
</script>
<style lang="scss" scoped>
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
  z-index: 99;
  margin: 10px;
  border: 1.5px solid rgba(125, 125, 125, 0.5);
  transition: all 0.2s ease-in-out;
}

.show {
  transform: translateY(0);
}

.search-bar {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  height: 40px;
  background-color: rgba(29, 29, 29, 1);
  border: 1px solid rgba(125, 125, 125, 0.3);
  width: 100%;
  padding: 10px;
  border-radius: 3px;
  border-bottom: 2px solid var(--highlight-color);
}

.menu-header {
  width: 100%;
  padding: 30px;
}

.search-bar input,
.search-bar .search-icon {
  border: none;
  background-color: rgba(29, 29, 29, 1);
  padding: 0;
  margin: 0;
  color: lightgrey;
  outline: none;
}

.search-bar .search-icon i {
  transform: rotate(90deg);
}

.search-bar input {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  color: lightgrey;
  background: none;
  padding: 0 20px;
  font-size: 14px;
}

.menu-footer {
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
