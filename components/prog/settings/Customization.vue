<template>
  <div class="customization">
    <h2>Personnalisation</h2>
    <div class="theme-selector">
      <div class="current-bg">
        <div class="bg-preview" :style="{ backgroundImage: `${currentTheme.bg}` }">
          <div class="over-bg">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
            <span class="line small"></span>
            <div class="button"></div>
          </div>
        </div>
      </div>
      <div>
        <h5>Sélectionnez un thème à appliquer</h5>
        <div class="theme-list">
          <div class="theme-preview theme-definer" v-for="theme in themes" :key="theme.name" :style="{
            backgroundImage: `${theme.bg}`,
            '--highlight-color': theme.highlight,
          }" :class="[
              { active: currentTheme.name == theme.name },
              theme.interface,
            ]" @click="changeTheme(theme)">
            <div class="over-bg">
              <div class="button"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ul class="customize-theme">
      <!-- Background picture -->
      <li>
        <div @click="clickAccordionHeader('background-picture')" class="header">
          <span class="left-icon">
            <fa :icon="['fas', 'image']" />
          </span>
          <span>Image d'arrière-plan</span>
          <span class="right-icon" :class="{ rotated: currentAccordion == 'background-picture' }">
            <fa :icon="['fas', 'chevron-down']" />
          </span>
        </div>
        <div class="accordion-content" :class="{ active: currentAccordion == 'background-picture' }">
          <label class="file-btn">
            <span>Téléverser votre image</span>
            <input type="file" @change="changeBackgroundPicture"  ref="bgImageInput"/>
          </label>
        </div>
      </li>
      <!-- Colors -->
      <li>
        <div @click="clickAccordionHeader('colors')" class="header">
          <span class="left-icon">
            <fa :icon="['fas', 'palette']" />
          </span>
          <span>Couleurs</span>
          <span class="right-icon" :class="{ rotated: currentAccordion == 'colors' }">
            <fa :icon="['fas', 'chevron-down']" />
          </span>
        </div>
        <div class="accordion-content" :class="{ active: currentAccordion == 'colors' }">
          <!-- Highlight color -->
          <div class="color-picker">
            <label>
              <span>Couleur d'accent</span>
              <input type="color" @change="changeAccentColor"/>
            </label>
          </div>
          <!-- Interface (light or dark) -->
          <div class="color-picker">
            <label>
              <select @change="changeInterfaceColor" :value="currentTheme.interface">
                <option value="light">Clair</option>
                <option value="dark">Foncé</option>
              </select>
            </label>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="js">
import { mapWritableState } from 'pinia';
import themes from '~/assets/config/themes.js'
import { useThemeStore } from '../../../store/theme';
export default {
  name: 'customization',
  data() {
    return {
      themes: themes,
      currentAccordion: null,
    }
  },
  methods: {
    changeTheme(theme) {
      // clone theme object
      const newTheme = JSON.parse(JSON.stringify(theme))
      this.currentTheme = newTheme;
      //reset the background picture
      this.$refs.bgImageInput.value = null;
    },
    clickAccordionHeader(name) {
      if (this.currentAccordion == name) {
        this.currentAccordion = null;
      } else {
        this.currentAccordion = name;
      }
    },
    changeBackgroundPicture(e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        this.currentTheme.bg = `url(${e.target.result})`;
        this.currentTheme.name = 'custom';
      };
      try {
        reader.readAsDataURL(file);
      } catch (e) {
        console.log(e);
      }
    },
    changeAccentColor(e) {
      this.currentTheme.highlight = e.target.value;
      this.currentTheme.name = 'Custom';
    },
    changeInterfaceColor(e) {
      this.currentTheme.name = 'Custom';
      this.currentTheme.interface = e.target.value;
    },
  },
  computed: {
    ...mapWritableState(useThemeStore, ['theme', 'currentTheme']),

  }
}
</script>
<style lang="scss" scoped>
.customization {
  width: 100%;
  height: 100%;
  max-width: 800px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .theme-selector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;

    h5 {
      margin-bottom: 10px;
      margin-top: 0;
    }

    .current-bg {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .bg-preview {
        width: 300px;
        height: 180px;
        border-radius: 6px;
        margin: 0;
        background: linear-gradient(to bottom right, #00bcd4, #0064a7);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        .over-bg {
          width: 70px;
          height: 75px;
          top: 80px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          left: 220px;
          flex-direction: column;
          background-color: $bg-color-1;
          border-radius: 4px;
          padding: 4px 10px;
          position: relative;

          .line {
            width: 100%;
            height: 1px;
            background-color: $txt-color;
            margin: 5px 0;
            top: 0;

            &.small {
              width: 50%;
            }
          }

          .button {
            width: 20px;
            height: 7px;
            background-color: $highlight-color;
            border-radius: 2px;
            align-self: flex-end;
            text-align: right;
            transform: translateX(12px);
            margin: auto;
          }
        }
      }
    }

    .theme-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      width: 350px;
      gap: 10px;
      flex-wrap: wrap;

      .theme-preview {
        width: 100px;
        height: 85px;
        border-radius: 6px;
        transition: filter 0.2s ease-in-out;

        &:hover {
          // filter brightness(0.8);
          filter: brightness(0.8);
        }

        &.active {
          border: 2px solid $txt-color;
        }

        .over-bg {
          width: 35px;
          height: 35px;
          display: flex;
          top: calc(100% - 45px);
          left: calc(100% - 45px);
          align-items: center;
          justify-content: flex-end;
          flex-direction: column;
          background-color: $bg-color-1;
          border-radius: 4px;
          padding: 6px 10px;
          position: relative;

          .button {
            height: 7px;
            width: 18px;
            background-color: $highlight-color;
            border-radius: 2px;
          }
        }
      }
    }
  }

  .customize-theme {
    display: flex;
    margin-top: 30px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    padding-bottom: 20px;

    li {
      width: 100%;
      border-radius: $border-radius-sm;
      background-color: $bg-color-2;
      transition: $transition;

      .header {
        font-size: 14px;
        font-weight: 500;
        color: $txt-color;
        display: flex;
        padding: 20px;
        align-items: center;
        justify-content: flex-start;
        transition: $transition;

        .left-icon {
          margin-right: 10px;
          font-size: 16px;
        }

        .right-icon {
          margin-left: auto;
          margin-right: 10px;
          font-size: 18px;
          transition: transform 0.4s ease-in-out;

          &.rotated {
            transform: rotate(180deg);
          }
        }

        &:hover {
          filter: brightness(1.2);
        }
      }

      .accordion-content {
        display: none;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 10px;
        width: 100%;
        background-color: $bg-color-2;

        &.active {
          display: flex;
          animation: fade-in 0.5s ease-in-out;
        }

        .file-btn {
          width: 100%;
          height: 40px;
          border-radius: $border-radius-sm;
          background-color: $bg-color-1;
          border: 1px solid $border-color;
          transition: $transition;
          display: flex;
          align-items: center;
          justify-content: center;

          input {
            display: none;
          }

          &:hover {
            filter: brightness(1.2);
          }
        }

        .color-picker,
        .color-picker label {
          width: 100%;
          height: 40px;
          border-radius: $border-radius-sm;
          background-color: $bg-color-1;
          border: 1px solid $border-color;
          transition: $transition;
          display: flex;
          align-items: center;
          justify-content: center;

          input[type='color'] {
            display: none;
          }

          select {
            padding: 5px;
            height: 100%;
            outline: none;
            border: none;
            width: 100%;
            color: $txt-color;
            background-color: $bg-color-1;
          }

          .color-picker-icon {
            font-size: 16px;
            margin-right: 10px;
          }

          &:hover {
            filter: brightness(1.2);
          }
        }
      }
    }
  }

  // on mobile devices
  @media screen and (max-width: 768px) {

    // set bg-preview width to 250px
    .theme-selector {

      .current-bg .bg-preview {
        width: 250px;

        .over-bg {
          left: 150px;
        }
      }

      .theme-list {
        width: 250px;
        justify-content: center;
      }
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
