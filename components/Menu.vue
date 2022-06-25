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
                    <input type="search" placeholder="Taper ici pour effectuer une recherche" v-model="search" />
                </div>
            </div>
            <div class="menu-list" :class="{ search: search !== '' }">
                <div class="menu-item" v-for="(menu, index) in menuItems" :key="index" @click="() => {
                    $store.dispatch('windows/createBaseWindow', menu.program);
                    $emit('toggle-menu')
                }">
                    <img :src="menu.imagePath" />
                    <span>{{ menu.title }}</span>
                </div>
            </div>
            <div class="menu-footer">
                <div class="login-user" @click="loginClick">
                    <img :src="loggedInUserPicture" format="webp" />
                    <span>{{ loggedInUserName }}</span>
                </div>
                <!--<div class="shutdown-btn" @click="togglePopup">
          <fa :icon="['fas', 'power-off']" />
        </div>-->
            </div>
        </div>
    </div>
</template>
<script lang="js">
import { mainMenu } from '~/assets/config/menus.js'
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
            search: '',
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
        loginClick() {
            this.$store.dispatch('windows/createBaseWindow', ['ProgSettings', { defaultTab: 'account' }]);
            this.$emit('toggle-menu', false);
        },
    },
    mounted() {
        if (!this.loaded) {
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
    computed: {
        loggedInUserName() {
            return this.$auth.user?.name || "Utilisateur de G-mal";
        },
        loggedInUserPicture() {
            return this.$auth.user?.picture?.data?.url || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200";
        },
        menuItems() {
            return mainMenu.filter(item => {
                return item.title.toLowerCase().includes(this.search.toLowerCase());
            });
        }
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
    background-color: rgba($hex-bg-color-1, 0.95);
    box-shadow: 0 8px 8px 0 rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    bottom: 50px;
    transform: translateY(110%);
    z-index: 99;
    margin: 10px;
    border: 1.5px solid $border-color;
    transition: all 0.2s ease-in-out;

    .menu-header {
        width: 100%;
        padding: 30px;

        .search-bar {
            display: flex;
            justify-content: center;
            flex-direction: row;
            align-items: center;
            height: 40px;
            background-color: $bg-color-0;
            border: 1px solid $border-color;
            width: 100%;
            padding: 10px;
            border-radius: 3px;
            border-bottom: 2px solid $highlight-color;
        }
    }

    .menu-list {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-self: center;
        flex-wrap: wrap;
        gap: 10px;
        padding: 0 30px;
        margin: 0;
        align-content: flex-start;
        list-style: none;
        border-radius: 3px;

        .menu-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            gap: 6px;
            padding: 10px 0;
            width: 80px;
            height: 83px;
            margin: 5px;
            border-radius: 3px;
            transition: $transition;

            img {
                width: 35px;
                height: 35px;
                object-fit: cover;
                background-color: transparent;
                object-position: center;
                transition: $transition;
            }

            span {
                font-size: 9px;
                font-weight: bold;
                color: $txt-color;
                text-align: center;
                // ellipsis: true;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;

            }

            &:hover {
                background-color: $hover-btn-color;
            }

            &:active {
                filter: brightness(0.8);
            }

        }

        &.search {
            // Return to a vertical list
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            .menu-item {
                width: 100%;
                flex-direction: row;
                justify-content: flex-start;
                height: auto;
                margin: 0;
                padding: 5px;
                border-radius: 0;
                border: none;
                background-color: transparent;
                border-bottom: 1px solid $border-color;


                span {
                    font-size: 12px;
                    font-weight: bold;
                    color: $txt-color;
                    text-align: left;
                    margin-left: 10px;
                }
            }
        }
    }

}

.show {
    transform: translateY(0);
}





.search-bar input,
.search-bar .search-icon {
    border: none;
    background-color: transparent;
    padding: 0;
    margin: 0;
    color: $txt-color;
    outline: none;
}

.search-bar .search-icon i {
    transform: rotate(90deg);
}

.search-bar input {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    color: $txt-color;
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
    border-top: 1px solid $border-color;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba($hex-bg-color-1, 0.95);
    color: $txt-color;

    >* {
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

        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            // cover
            object-fit: cover;
        }
    }
}
</style>
