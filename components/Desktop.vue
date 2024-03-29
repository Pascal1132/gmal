<template>
  <div>
    <LazyPopupMenu class="contextmenu" :showMenu="showMenu" :pos="popupPosition">
      <ul v-if="currentContextMenuElementSelected" v-html="currentContextMenuElementSelected"></ul>
      <ul v-else>
        <li @click="launchSettings">Changer l'image du fond</li>
      </ul>
    </LazyPopupMenu>
    <div class="desktop" @contextmenu="contextMenuClick" :style="{ backgroundImage: `${currentTheme.bg}` }">
      <!-- On right click -->
      <div class="launcher">
        <img src="/images/recycle_bin.png" format="webp" />
        <label>Corbeille</label>
      </div>
      <div class="no-icon" v-for="i in nbOfIconPossible" :key="i" :style="{ order: i }"></div>
    </div>
  </div>
</template>
<script lang="js">
import { mapActions, mapState } from 'pinia';
import { useThemeStore } from '~/store/theme.js'
import { useWindowsStore } from '~/store/windows.js'
export default {
  name: 'Desktop',
  setup() {
    const { createBaseWindow } = useWindowsStore();
    return {
      createBaseWindow,
    }
  },
  data() {
    return {
      showMenu: false,
      popupPosition: {
        top: 0,
        left: 0,
      },
      nbOfIconPossible: 500,
      currentContextMenuElementSelected: null,
      currentElementDrag: null,
      loaded: false,
    }
  },
  methods: {
    contextMenuClick(e) {
      if (e.target.classList.contains('launcher') || e.target.parentElement.classList.contains('launcher')) {
        this.currentContextMenuElementSelected = e.currentTarget.querySelector('.context-menu-properties')?.innerHTML ?? null;
      } else {
        this.currentContextMenuElementSelected = null;
      }

      e.preventDefault();
      this.popupPosition = {
        top: e.clientY,
        left: e.clientX,
      };
      this.showMenu = true;
    },
    launchSettings() {
      this.showMenu = false;
      this.createBaseWindow('ProgSettings', { defaultTab: 'customization' });
    },
  },
  mounted() {
    if (!this.loaded) {

      // on click outside of the menu
      document.addEventListener('click', (e) => {
        if (this.showMenu) {
          this.showMenu = false;
          this.currentContextMenuElementSelected = null;
        }
      });

      // on click on the .contextmenu element stop propagation
      this.$el.querySelector('.contextmenu').addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // make .launcher draggable with mousemove
      this.$el.querySelector('.launcher').addEventListener('mousedown', (e) => {
        const el = e.currentTarget;
        this.currentElementDrag = el;
        //
      });

      // make .launcher draggable with mousemove
      document.addEventListener('mousemove', (e) => {
        if (this.currentElementDrag) {
          this.currentElementDrag.style.position = 'absolute';
          const rect = this.currentElementDrag.getBoundingClientRect();
          this.currentElementDrag.style.left = (e.clientX - rect.width / 2) + 'px';
          this.currentElementDrag.style.top = (e.clientY - rect.height / 2) + 'px';
          // if the cursor is inside a .no-icon element, than show this element
          const noIcon = document.querySelectorAll('.no-icon');
          for (let i = 0; i < noIcon.length; i++) {
            const rect = noIcon[i].getBoundingClientRect();
            if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
              noIcon[i].style.opacity = 1;
            } else {
              noIcon[i].style.opacity = 0;
            }
          }


        }
      });

      // make .launcher draggable with mouseup
      document.addEventListener('mouseup', (e) => {
        if (this.currentElementDrag) {
          // reset position (top and left) as default
          this.currentElementDrag.style.position = 'relative';
          this.currentElementDrag.style.top = 0;
          this.currentElementDrag.style.left = 0;
          // display none the launcher
          this.currentElementDrag.style.display = 'none';
          // top 0 and left 0

          let noIconFound = null;

          let noIcon = document.querySelectorAll('.no-icon');
          for (let i = 0; i < noIcon.length; i++) {
            const rect = noIcon[i].getBoundingClientRect();
            noIcon[i].style.opacity = 0;
            if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
              noIconFound = noIcon[i];
            }
          }
          // set position to the nearest .no-icon element
          if (noIconFound) {
            // get order of the .no-icon element
            let order = noIconFound.style.order;
            // get order of the currentElementDrag
            let orderDrag = this.currentElementDrag.style.order;
            // change order of the currentElementDrag
            this.currentElementDrag.style.order = order;
            // change order of the .no-icon element
            noIconFound.style.order = orderDrag;

            noIcon = document.querySelectorAll('.no-icon');
            for (let i = 0; i < noIcon.length; i++) {
              noIcon[i].style.order = i + 1;
            }


          } else {
            // reset position (top and left) as default
            this.currentElementDrag.style.position = 'relative';
            // top 0 and left 0
            this.currentElementDrag.style.top = 0;
            this.currentElementDrag.style.left = 0;

          }
          // display the launcher
          this.currentElementDrag.style.display = 'flex';
          this.currentElementDrag = null;
        }
      });
      this.loaded = true;
    }
  },
  computed: {
    ...mapState(useThemeStore, ['currentTheme']),
  },
}
</script>
<style lang="scss" scoped>
.desktop {
  display: flex;
  padding: 5px 3px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  // wrap with size of 70px
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  gap: 5px;
  height: 100%;
  color: white;
  background-size: cover;
  background-position: center;
  z-index: -55;

  .launcher {
    height: 85px;
    width: 85px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;

    align-items: center;
    gap: 2px;

    svg,
    img {
      font-size: 30px;
      height: 50px;
    }

    label {
      font-size: 11px;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  .no-icon {
    opacity: 0;
    width: 85px;
    height: 85px;
    z-index: -2;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .context-menu-properties {
    display: none;
  }
}
</style>
