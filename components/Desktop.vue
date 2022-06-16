<template>
  <div>
    <PopupMenu class="contextmenu" :showMenu="showMenu" :pos="popupPosition">
      <ul
        v-if="currentContextMenuElementSelected"
        v-html="currentContextMenuElementSelected"
      ></ul>
      <ul v-else>
        <li>Changer l'image du fond</li>
      </ul>
    </PopupMenu>
    <div class="desktop">
      <!-- On right click -->
      <div class="launcher">
        <img src="images/recycle_bin.png" />
        <label>Corbeille</label>
        <div class="context-menu-properties">
          <li>Propriétés de la corbeille</li>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js">
export default {
    name: 'Desktop',
    data() {
        return {
            showMenu: false,
            popupPosition: {
                top: 0,
                left: 0,
            },
            currentContextMenuElementSelected: null,
            currentElementDrag: null,
        }
    },
    mounted() {
        // on right click on the desktop
        document.addEventListener('contextmenu', (e) => {
            // if currenttarget is a launcher or the parent div contains a launcher
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
        });

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
            this.currentElementDrag.style.position = 'absolute';
        });

        // make .launcher draggable with mousemove
        document.addEventListener('mousemove', (e) => {

            if (this.currentElementDrag) {
                const rect = this.currentElementDrag.getBoundingClientRect();
                this.currentElementDrag.style.left = (e.clientX - rect.width/2) + 'px';
                this.currentElementDrag.style.top = ( e.clientY - rect.height/2) + 'px';
            }
        });

        // make .launcher draggable with mouseup
        document.addEventListener('mouseup', (e) => {
            if (this.currentElementDrag) {
                this.currentElementDrag.position = 'relative';
                this.currentElementDrag = null;

            }
        });
    },
}
</script>
<style lang="scss" scoped>
.desktop {
  display: grid;
  padding: 5px 3px;
  grid-template-columns: auto auto auto auto;
  grid-template-rows: auto auto auto auto;
  grid-auto-flow: column;
  width: 100%;
  height: 100%;
  color: white;
  .launcher {
    width: 85px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    padding: 7px;
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
  .context-menu-properties {
    display: none;
  }
}
</style>
