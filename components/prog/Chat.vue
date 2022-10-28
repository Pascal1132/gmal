<template>
  <div>
    <button @click="sendMessage">Send</button>
    {{messages}}
  </div>
</template>
<script>
export default {
  name: 'Chat',
  setup() {
    const {messages, send} = useSocketStore();
    return {
      messages,
      send
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
      this.send('Hello World');
    }
  }
}
</script>