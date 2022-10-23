<template>
  <div class="settings" :class="{ small: isSmall }">
    <nav>
      <div class="nav-header">
        <div class="nav-header-account">
          <div class="nav-header-account-avatar">
            <img :src="loggedInUserPicture" alt="" format="webp" />
          </div>
          <div class="nav-header-account-name">
            <span>{{ loggedInUserName }}</span>
            <span class="account-type">Compte local</span>
          </div>
        </div>
        <div class="nav-header-search">
          <input type="search" placeholder="Trouver un paramètre" v-model="search" />
          <fa class="search-icon" :icon="['fas', 'magnifying-glass']" />
        </div>
      </div>
      <div class="nav-body">
        <div class="nav-body-item" v-for="tab in getTabsBySearch" :key="tab.name"
          :class="{ active: currentTab == tab.name }" @click="currentTab = tab.name">
          <div class="nav-body-item-icon">
            <img :src="'images/programs/settings/' + tab.icon" />
          </div>
          <div class="nav-body-item-title">
            <span>{{ tab.title }}</span>
          </div>
        </div>
      </div>
    </nav>
    <main>
      <Component v-for="tab in tabs" :key="tab.name" :class="{ active: currentTab == tab.name }"
        :is="tab.component" />
    </main>
  </div>
</template>
<script lang="js">
import System from './settings/System.vue';
import Account from './settings/Account.vue';
import Customization from './settings/Customization.vue';

export default {
  name: 'Settings',
  components: {
    System, Account, Customization,
  },
  setup() {
    const firebaseUser = useFirebaseUser();

    return {
      firebaseUser,
    };
  },
  data() {
    return {
      tabs: [
        {
          name: 'system',
          title: 'Système',
          icon: 'system.ico',
          component: 'System',
        },
        {
          name: 'account',
          title: 'Compte',
          icon: 'account.ico',
          component: 'Account',
        },
        {
          name: 'customization',
          title: 'Personnalisation',
          icon: 'paint_brush.svg',
          component: 'Customization',
        }
      ],
      currentTab: 'system',
      search: '',
    }
  },
  props: {
    windowKey: {
      type: Number,
      default: 0,
    },
    defaultTab: {
      type: String,
      default: 'system',
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.currentTab = this.defaultTab;
    this.$emit('set-window-frame', {
      id: this.windowKey,
      title: 'Paramètres',
      size: {
        width: 700,
        height: 500,
        minWidth: 500,
        minHeight: 400,
      },
      iconPath: 'images/settings.png',
    });
  },
  computed: {
    getTabsBySearch() {
      return this.tabs.filter(tab => {
        return tab.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    loggedInUserName() {
      return this.firebaseUser?.displayName || "Utilisateur de G-mal";
    },
    loggedInUserPicture() {
      return  this.firebaseUser?.photoURL || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200";
    }
  }
}
</script>
<style lang="scss">
.settings {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  nav {
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 100%;

    .nav-header {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      gap: 10px;

      .nav-header-account {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding: 5px;

        overflow: hidden;

        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }

        .nav-header-account-name {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;

          margin-left: 10px;
          font-size: 14px;

          .account-type {
            font-size: 11px;
            color: $txt-color;
          }
        }
      }

      .nav-header-search {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        background-color: $bg-color-2;
        border-radius: $border-radius-sm;
        border-bottom: 1px solid #aaa;
        transition: all 0.2s ease-in-out;

        overflow: hidden;

        input {
          border: none;
          outline: none;
          width: 100%;
          background: transparent;
          padding: 0 10px;
          font-size: 15px;

          color: $txt-color;
        }

        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          margin-right: 10px;
          height: 12px;

          overflow: hidden;
          transform: rotate(90deg);
        }

        &:focus-within {
          border-bottom: 2px solid $highlight-color;
          background-color: $bg-color-0;
        }
      }
    }

    .nav-body {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;

      .nav-body-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 30px;
        padding: 5px 7px;

        overflow: hidden;

        border-radius: $border-radius-sm;
        transition: all 0.2s ease-in-out;

        // add a line with before attribute at the left of the items
        &:before {
          content: '';
          display: block;
          position: relative;
          left: -13px;
          width: 3px;
          height: 12px;
          border-radius: 5px;
          transition: all 0.2s ease-in-out;
          background-color: $highlight-color;
        }

        overflow: hidden;

        .nav-body-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;

          overflow: hidden;

          img {
            width: 15px;
            height: 15px;
            object-fit: cover;
          }
        }

        .nav-body-item-title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;

          margin-left: 10px;
          font-size: 14px;
          color: $txt-color;
        }

        &:hover,
        &.active {
          background-color: $bg-color-2;
        }

        &.active {
          &:before {
            left: -7px;
            height: 14px;
          }
        }
      }
    }
  }

  main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    margin-left: 10px;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4px;

    > :not(.active) {
      display: none;
    }

    >.active {
      animation: tabEnter 0.3s ease-in-out;
    }

    @media screen and (max-width: 768px) {
      overflow-x: auto;

    }
  }

  &.small {
    nav {
      width: 50px;

      .nav-header {
        padding: 0;

        .nav-header-account {
          justify-content: center;

          .nav-header-account-name {
            display: none;
          }
          .nav-header-account-avatar {
            width: 30px;
            height: 30px;

            img {
              width: 30px;
              height: 30px;
            }
          }
        }

        .nav-header-search {
          display: none;
        }
      }

      .nav-body {
        padding: 0;

        .nav-body-item {
          width: 100%;
          height: 40px;
          justify-content: center;

          .nav-body-item-title {
            display: none;
          }

          &:before {
            display: none;
          }

          &.active {}
        }
      }
    }

    main {
      width: 100%;
    }
  }
}

@keyframes tabEnter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>
