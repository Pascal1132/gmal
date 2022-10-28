<template>
  <div id="chat">
    <div class="list" ref="list">
      <div v-for="message in messages" :key="message.id">
        <div class="message">
          <div>
            <div class="message__text">{{ message.data.text }}</div>
            <div class="message__time">{{ message.createdAt }}</div>
          </div>
          <div class="message__username">{{ message.data.username }}</div>
        </div>
      </div>
    </div>
    <div class="input-container">
      <input type="text" v-model="msg" @keydown="onKeyDown" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Chat',
  setup() {
    const { messages, send } = useSocketStore();
    return {
      messages,
      send
    }
  },
  data() {
    return {
      msg: ''
    }
  },
  props: {
    windowKey: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    this.$emit('set-window-frame', {
      id: this.windowKey,
      title: 'Chat',
      isMinimized: false,
      size: {
        width: 700,
        height: 500,
        minWidth: 400,
        minHeight: 400,
      },
      iconPath: 'images/programs/chat.png',
    });
  },
  methods: {
    sendMessage() {
      this.send(this.msg);
      this.msg = '';
      setTimeout(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
      }, 100);
    },
    onKeyDown(e) {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    }
  },
  // on change of messages deep, scroll to bottom
  watch: {
    messages: {
      handler() {
        setTimeout(() => {
          this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
        }, 100);
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss">
#chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  .list {
    flex: 1;
    overflow-y: auto;

    .message {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ccc;

      .message__text {
        flex: 1;
        margin-right: 10px;
      }
      .message__time {
        font-size: 0.8em;
        color: #666;
      }
    }
  }

  .input-container {
    display: flex;
    padding: 10px;

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button {
      margin-left: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #ccc;
      cursor: pointer;
    }
  }
}
</style>