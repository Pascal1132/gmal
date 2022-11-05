<template>
  <div id="chat" :class="{small: isSmall, medium: isMedium}">
    <div class="not-connected" :class="{show: showNotConnected}">
      <h1>Vous n'êtes pas connecté</h1>
      <p>Pour accéder au chat, vous devez être connecté.</p>
      <button @click="goToLogin">Se connecter</button>
    </div>
    <div id="new-conversation-modal" :class="{ show: isPopupShowed }" @click="hidePopup">
      <div class="modal-body" @click="stopPropagation">
        <div class="title">
          Nouvelle Conversation
        </div>
        <div class="input">
          <input type="text" placeholder="Nom d'utilisateur" ref="searchInput" v-model="searchString" @input="fetchResult" />
        </div>
        <!--List search-->
        <div class="search-result">
          <div class="item" v-for="(user, index) in users" :key="index" @click="selectUser(user)"
            :class="{ disabled: user.isAlreadyInConversation }">
            <div class="picture">
              <img :src="user.photoURL" />
            </div>
            <div class="info">
              <div class="name">
                {{ user.displayName }}
              </div>
            </div>
          </div>
          <div class="loader" v-if="isLoading">
            <div class="loader__spinner"></div>
          </div>
          <div class="no-result" v-else-if="users.length === 0">
            Aucun résultat
          </div>
        </div>
      </div>
    </div>
    <ProgChatConversationList @on-select-conversation="onSelectConversation" @new-conversation="showPopup" :isSmall="isSmall" :isMedium="isMedium"
      :conversations="conversations" :selected-conversation-id="selectedConversationId" @send-message="sendMessage" />
  </div>
</template>
<script>
import { mapActions } from 'pinia';
import WsEvent from '~~/server/models/ws_event';
import Conversation from './chat/Conversation';
import ConversationMessage from './chat/ConversationMessage';

export default {
  name: 'Chat',
  setup() {
    const { send } = useSocketStore();
    const { conversations } = useChatStore();
    const { createBaseWindow } = useWindowsStore();
    return {
      send,
      conversations,
      createBaseWindow,
    }
  },
  data() {
    return {
      msg: '',
      users: [],
      selectedConversationId: null,
      isPopupShowed: false,
      isLoading: false,
    }
  },
  props: {
    windowKey: {
      type: Number,
      default: 0,
    },
    isSmall: {
      type: Boolean,
      required: true,
    },
    isMedium: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    // Check if user is connected
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
    ...mapActions(useUsersStore, ['searchUsersByDisplayName']),
    ...mapActions(useSocketStore, ['send']),
    showPopup() {
      this.isPopupShowed = true;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    hidePopup() {
      this.isPopupShowed = false;
    },
    stopPropagation(e) {
      e.stopPropagation();
    },
    selectUser(user) {
      this.hidePopup();
      if (!user.isAlreadyInConversation) {
        this.send({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, WsEvent.TYPES.NEW_CONVERSATION);
      } else {
        this.selectedConversationId = user.uid;
      }
      user.isAlreadyInConversation = true;
    },
    onSelectConversation(conversation) {
      this.selectedConversationId = conversation.id;
    },
    sendMessage(message) {
      // add the message to the conversation
      const conversation = this.conversations.find(
        (conversation) => conversation.id === this.selectedConversationId,
      );
      const date = new Date();
      conversation.addMessage(new ConversationMessage(date.toISOString, message, date, true));
      this.send({
        content: message,
        to: this.selectedConversationId,
        conversationId: this.selectedConversationId,
      }, WsEvent.TYPES.NEW_MESSAGE);
    },
    async fetchResult() {
      this.isLoading = true;
      const res = await this.searchUsersByDisplayName(this.searchString);
      this.users = res.map((user) => {
        return {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAlreadyInConversation: this.conversations.some((conversation) => conversation.id === user.uid),
        }
      });
      this.isLoading = false;
    },
    goToLogin(e) {
      e.preventDefault();
      e.stopPropagation();
        this.createBaseWindow('ProgSettings', { defaultTab: 'account' })
    }
  },
  computed: {
    showNotConnected() {
      return !isAuth();
    },
  },
  // watch isSmall and isMedium to change the size of the window
  watch: {
    isSmall: {
      handler(isSmall) {
      },
      immediate: true,
    },
    isMedium: {
      handler(isMedium) {

      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss">
#chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .not-connected {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    height: calc(100% - 40px);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: none;
    &.show {
      opacity: 1;
      visibility: visible;
      display:flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      button {
        margin-top: 20px;
        background-color: $bg-color-2;
        border: 1px solid $border-color;
        color: $txt-color;
        padding: 10px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &:hover {
          background-color: $bg-color-1;
        }
      }
    }
  }

  #new-conversation-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;

    .modal-body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 200px;
      background-color: $bg-color-1;
      border-radius: $border-radius-sm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px;

      .title {
        font-size: 20px;
        font-weight: bold;
      }

      .input {
        width: 100%;
        height: 50px;
        display: flex;
        margin: 5px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;

        input {
          width: 100%;
          height: 100%;
          border: 2px solid $border-color;
          border-radius: 3px;
          padding: 5px 10px;
          background-color: $bg-color-2;
          color: $txt-color;
          font-size: 16px;


          &:focus {
            outline: none;
          }
        }
      }

      .search-result {
        width: 100%;
        height: 100%;
        overflow-y: scroll;

        .item {
          width: 100%;
          height: 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          padding: 0 10px;

          &:hover {
            background-color: $bg-color-2;
          }

          .picture {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .info {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 5px;

            .name {
              font-size: 16px;
              font-weight: bold;
            }
          }

          &.disabled {
            opacity: 0.5;
          }
        }
      }

      .no-result {
        padding: 10px;
        color: $txt-color;
      }
    }

    &:not(.show) {
      display: none;
    }

    &.show {
      animation: fadeIn 0.3s ease-in-out forwards;
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }
  }
}
</style>