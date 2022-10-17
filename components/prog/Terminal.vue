<template>
  <div ref="terminal" id="terminal" :class="[currentTheme.interface]">
    <div class="body" ref="terminalBody">
      <p>Welcome to GMalTerminal!</p>
      <p></p>
      <p>Enter a command to get started.</p>
      <p></p>
      <p style="color:gray">Tap : help to see all commands.</p>
      <p></p>
      <p v-for="(message, index) in notHiddenMessages">
        <span class="prefix" v-if="message.prefix">{{message.prefix}}</span>
        <span class="message" v-if="message.body">{{message.body}}</span>
        <span class="message-html" v-if="message.html" v-html="message.html"></span>
      </p>
      <p v-if="showInput"><span class="prefix">{{currentPrefix}}</span><span
          class="message">{{currentCommand}}</span><span id="blink-indicator"
          :class="{stopAnimation: (stopBlinkAnimation || !isCurrentActiveWindow)}"></span></p>
    </div>
  </div>
</template>
<script lang="js">
import { mapState } from 'pinia';
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
    }
  },
  props: {
    windowKey: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    async newTab() {
      // random id
      const id = Math.floor(Math.random() * 100000000);
      this.tabs.push(id);
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
    // listen to keydown
    document.addEventListener('keydown', async (e) => {
      if (!this.isCurrentActiveWindow) return;
      e.preventDefault();
      this.stopBlinkAnimation = true;
      if (e.key == 'Enter') {
        this.showInput = false;
        this.messages = await CommandHandler.handleCommand(this.currentCommand, this.messages, this.currentPrefix);
        this.currentCommand = '';
        this.showInput = true;
        this.$nextTick(() => {
          this.$refs.terminalBody.scrollTop = this.$refs.terminalBody.scrollHeight;
        });

        //force scroll to bottom to parent of terminal
      } else if (e.key == 'Backspace') {
        this.currentCommand = this.currentCommand.slice(0, -1);
      } else {
        // check if the key is a letter or number
        if (e.key.length == 1) {
          this.currentCommand += e.key;
        }
        // If the key is a space or a period, add it
        if (e.key == ' ' || e.key == '.') {
          this.currentCommand += e.key;
        }

        // If it is an arrow key, take the previous command
        if (e.key == 'ArrowUp') {
          // take the indexArrowSelection and get the command from the messages with a prefix
          if ((this.indexArrowSelection + 1) < this.messages.length) {
            const filteredMessages = this.messages.filter((message) => message.prefix);
            if (filteredMessages.length - 1 - (this.indexArrowSelection + 1) >= 0) {
              this.indexArrowSelection++;
              this.currentCommand = filteredMessages[filteredMessages.length - 1 - this.indexArrowSelection].body;
            }
          }
        }
        // If it is an arrow key down
        if (e.key == 'ArrowDown') {
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
        }
      }
      const prevCurrentCommandString = this.currentCommand;
      setTimeout(() => {
        if (this.currentCommand == prevCurrentCommandString) {
          this.stopBlinkAnimation = false;
        }
      }, 500);
    });
  },
  // Destroy, remove listener
  beforeDestroy() {
    document.removeEventListener('keydown');
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
  }
}
</script>
<style lang="scss" scoped>
#terminal {
  height: 100%;
  width: 100%;

  &.dark {
    --tab-bg: #333;
    --tab-active-bg: #111;
  }

  &.light {
    --tab-bg: #555;
  }

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

    font-family: 'Courier New', Courier, monospace;

    p {
      padding: 0;
      margin: 0;
      margin-bottom: 3px;
      max-width: 100%;
      word-wrap: break-word;
      min-height: 15px;

      .prefix {
        color: #0f0;
      }

      #blink-indicator {
        animation: blink 1s infinite;
        height: 15px;
        display: inline-block;
        width: 9px;
        background: #aaa;

        &.stopAnimation {
          animation: none;
        }
      }

      @keyframes blink {
        0% {
          opacity: 0;
        }

        49% {
          opacity: 0;
        }

        50% {
          opacity: 1;
        }

        100% {
          opacity: 1;
        }
      }
    }
  }
}
</style>
  