<template>
  <div ref="terminal" id="terminal" :class="[currentTheme.interface]" @click="focusDummyInput()">
    <div class="body" ref="terminalBody">
      <p>Welcome to GMalTerminal!</p>
      <p></p>
      <p>Enter a command to get started.</p>
      <p></p>
      <p style="color: gray">Tap : help to see all commands.</p>
      <p></p>
      <p v-for="(message, index) in notHiddenMessages" :key="index">
        <span class="prefix" v-if="message.prefix">{{ message.prefix }}</span>
        <span class="message" v-if="message.body">{{ message.body }}</span>
        <span class="message-html" v-if="message.html" v-html="message.html"></span>
      </p>
      <p v-if="showInput">
        <span class="prefix">{{ currentPrefix }}</span><span class="message">{{ startPartOfCurrentCommand }}</span><span id="blink-indicator" :class="{
            stopAnimation: stopBlinkAnimation || !(isCurrentActiveWindow),
          }">{{middlePartOfCurrentCommand}}</span>
          <span>{{ endPartOfCurrentCommand }}</span>
      </p>
      <input
          type="search" ref="dummyInput" @input="onInput" id="dummyInput" :value="currentCommand" @blur="onBlur"
          v-on:keyup.enter="onSubmit" @keydown.up="onUp" @keydown.down="onDown" @keydown="updateSelectionStart()" @keyup="updateSelectionStart()"/>
    </div>

  </div>
</template>
<script lang="js">
import { mapActions, mapState } from 'pinia';
import CommandHandler from './terminal/CommandHandler.js';

export default {
  name: 'Terminal',
  data() {
    return {
      tabs: [],
      messages: [],
      currentTab: null,
      currentCommand: '',
      showInput: true,
      prevCurrentCommandString: '',
      stopBlinkAnimation: false,
      currentPrefix: 'root@g-mal.ca:~/# ',
      indexArrowSelection: -1,
      inputSelectionStart: 0,
      isMobileDevice: false,
    }
  },
  props: {
    windowKey: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    ...mapActions(useWindowsStore, ['setActiveWindow']),
    async newTab() {
      // random id
      const id = Math.floor(Math.random() * 100000000);
      this.tabs.push(id);
    },
    focusDummyInput() {
      this.$refs.dummyInput.focus();
      this.stopBlinkAnimation = false;
    },
    async onSubmit() {
     this.showInput = false;
      this.messages = await CommandHandler.handleCommand(this.currentCommand, this.messages, this.currentPrefix);
      this.currentCommand = '';
      this.showInput = true;
      this.$nextTick(() => {
        this.$refs.terminalBody.scrollTop = this.$refs.terminalBody.scrollHeight;
        
      });
      this.indexArrowSelection = -1;
      this.focusDummyInput();
    },
    onInput(e) {
      this.stopBlinkAnimation = true;
      this.currentCommand = e.target.value;
      const prevCurrentCommandString = this.currentCommand;

      this.inputSelectionStart = e.target.selectionStart;
      setTimeout(() => {
        if (this.currentCommand == prevCurrentCommandString) {
          this.stopBlinkAnimation = false;
        }
      }, 500);
    },
    onUp(e) {
      // if device is not a mobile device
      if (this.isMobileDevice) return;
      if (!this.isCurrentActiveWindow) return;
      this.stopBlinkAnimation = false;
      e.preventDefault();

      if (this.currentCommand == '') {
        this.prevCurrentCommandString = '';
      }
      if ((this.indexArrowSelection + 1) < this.messages.length) {
        const filteredMessages = this.messages.filter((message) => message.prefix);
        if (filteredMessages.length - 1 - (this.indexArrowSelection + 1) >= 0) {
          this.indexArrowSelection++;
          this.currentCommand = filteredMessages[filteredMessages.length - 1 - this.indexArrowSelection].body;
        }
      }
      this.inputSelectionStart = e.target.selectionStart;

    },
    onDown(e) {
      if (this.isMobileDevice) return;
      if (!this.isCurrentActiveWindow) return;
      this.stopBlinkAnimation = false;
      e.preventDefault();
      if (this.indexArrowSelection > 0) {
        this.indexArrowSelection--;
        const filteredMessages = this.messages.filter((message) => message.prefix);
        if (filteredMessages.length - 1 - this.indexArrowSelection >= 0) {
          const tempCommand = filteredMessages[filteredMessages.length - 1 - this.indexArrowSelection].body;
          this.currentCommand = tempCommand ? tempCommand : '';
        }
      }
      // if index arrow selection is equal to 0, than 
      else if (this.indexArrowSelection == 0) {
        this.currentCommand = this.prevCurrentCommandString;
        this.indexArrowSelection = -1;
      }
      this.inputSelectionStart = e.target.selectionStart;

    },
    updateSelectionStart() {
      this.stopBlinkAnimation = true;
      this.inputSelectionStart = this.$refs.dummyInput.selectionStart;
      const prevInputSelectionStart = this.inputSelectionStart;
      setTimeout(() => {
        if (this.inputSelectionStart == prevInputSelectionStart) {
          this.stopBlinkAnimation = false;
        }
      }, 500);
    },
    onBlur() {
      this.setActiveWindow(null);
    },
  },
  mounted() {
    this.$emit('set-window-frame', {
      id: this.windowKey,
      title: 'Terminal',
      size: {
        width: 700,
        height: 500,
        minWidth: 500,
        minHeight: 400,
      },
      iconPath: 'images/programs/terminal.ico',
    });
    // focus on input
    this.$refs.dummyInput.focus();
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  computed: {
    ...mapState(useThemeStore, ['currentTheme']),
    ...mapState(useWindowsStore, ['activeWindowId']),
    isDark() {
      return this.currentTheme.interface == 'dark';
    },
    isCurrentActiveWindow() {
      return this.activeWindowId == this.windowKey;
    },
    notHiddenMessages() {
      return this.messages.filter((message) => !message.hidden);
    },
    startPartOfCurrentCommand() {
      return this.currentCommand.substring(0, this.inputSelectionStart);
    },
    endPartOfCurrentCommand() {
      return this.currentCommand.substring(this.inputSelectionStart + 1, this.currentCommand.length);
    },
    middlePartOfCurrentCommand() {
      return this.currentCommand.substring(this.inputSelectionStart, this.inputSelectionStart + 1);
    },
  },
  // watch on isCurrentActiveWindow, if it is true, then focus on input
  watch: {
    isCurrentActiveWindow() {
      if (this.isCurrentActiveWindow) {
        this.focusDummyInput();
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#terminal {
  height: 100%;
  width: 100%;

    --tab-bg: #333;
    --tab-active-bg: #111;
    --prefix-color: #0f0;


  .header {
    display: flex;
    flex-direction: row;

    .tabs {
      display: flex;
      flex-direction: row;
      width: 100%;
      overflow: scroll;

      .tab {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 5px;
        font-size: small;
        padding: 7px 20px 5px 20px;
        border-radius: 5px 5px 0 0;
        min-width: 250px;

        margin: 0px 5px 0 5px;
        background: var(--tab-bg);

        img {
          height: 15px;
        }

        &.active {
          background: var(--tab-active-bg);
        }
      }
    }
  }

  .body {
    background: var(--tab-active-bg);
    height: 100%;
    width: 100%;
    max-width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    color: #fff;
    font-family: "Courier New", Courier, monospace;

    p {
      padding: 0;
      margin: 0;
      margin-bottom: 3px;
      max-width: 100%;
      word-wrap: break-word;
      min-height: 15px;

      .prefix {
        color: var(--prefix-color);
      }

      #blink-indicator {
        animation: blink 1s infinite;
        height: 15px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        width: 9px;
        background: #aaa;
        color: #aaa;


        &.stopAnimation {
          animation: none;
        }
      }

      @keyframes blink {
        0% {
          background: rgba(170, 170, 170, 0);
        color: #fff;

        }

        49% {
          background: rgba(170, 170, 170, 0);
        color: #fff;

        }

        50% {
          background: #aaa;
        color: #aaa;

        }

        100% {
          background: #aaa;
        color: #aaa;

        }
      }
    }
  }

  #dummyInput {
    opacity: 0;
    -webkit-transition: 200ms;
    -moz-transition: 200ms;
    -ms-transition: 200ms;
    -o-transition: 200ms;
    transition: 200ms;
    position: absolute;
    user-select: none;
  }
}
</style>
  