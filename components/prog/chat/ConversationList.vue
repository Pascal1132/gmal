<template>
    <div id="conversation-list">
        <div id="list">
            <!-- new conversation button -->
            <div class="new-conversation" @click="newConversation">
                <div class="name">
                    Nouvelle conversation
                </div>
                <div class="icon">
                    <fa :icon="['fas', 'plus']" />
                </div>
            </div>
            <div v-for="(conversation, index) in conversations" :key="index" class="conversation"
                :class="{ selected: selectedConversationId == conversation.id }"
                @click="selectConversation(conversation)">
                <div class="picture">
                    <img :src="conversation.picture">
                </div>
                <div class="info">
                    <div class="name">
                        {{ conversation.displayName }}
                    </div>
                    <div v-if="conversation.lastMessage" class="last-message" :class="{ unread: conversation.lastMessage.isRead }">
                        {{ conversation.lastMessage.isMine ? 'Moi: ' : ''}}
                        {{ conversation.lastMessage.text }}
                    </div>
                </div>
                <div class="last-message-time" v-if="conversation.lastMessage">
                    {{ conversation.lastMessage.getReadableTime() }}
                </div>
            </div>
            <div v-if="conversations.length<1">
                <div class="no-conversation">
                    Aucune conversation
                </div>
            </div>
        </div>
        <div id="view">
            <ProgChatConversationView :conversation="selectedConversation" @send="(msg) => $emit('send-message', msg)" />
        </div>
    </div>
</template>
<script>
import Conversation from './Conversation';

export default {
    name: 'ConversationList',
    props: {
        conversations: {
            type: Array,
            default: () => [],
        },
        selectedConversationId: {
            type: String,
            default: null,
        },
    },
    methods: {
        newConversation() {
            this.$emit('new-conversation');
        },
        selectConversation(conversation) {
            this.$emit('on-select-conversation', conversation);
        },
    },
    computed: {
        selectedConversation() {
            return this.conversations.find((conversation) => conversation.id == this.selectedConversationId);
        },
    },
}
</script>
<style lang="scss" scoped>
#conversation-list {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-around;
    align-items: flex-start;
    padding: 5px;

    #list {
        padding: 10px;
        flex: 1;
        overflow-y: auto;
        border-right: 2px solid $border-color;
        min-width: 320px;
        max-width: 320px;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .new-conversation {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 40px;
            gap: 10px;
            background-color: $border-color;
            border-radius: $border-radius-sm;
            padding: 0 5px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;

            &:hover {
                background-color: $bg-color-2;
            }

            .icon {
                width: 30px;
                height: 30px;
                border-radius: 10%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .name {
                font-size: 20px;
            }
        }

        .conversation {
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 10px;
            gap: 5px;
            cursor: pointer;
            transition: all 0.1s ease-in-out;

            &:hover {
            }

            .picture {
                img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }

            .info {
                margin-left: 10px;
                flex: 1;

                .name {
                    font-weight: bold;
                }

                .last-message {
                    font-size: 0.8em;
                    width: 155px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    // if last message is unread, show bold
                    &.unread {
                        font-weight: bold;
                    }

                }
            }

            .last-message-time {
                font-size: 0.8em;
            }

            &.selected {
                filter: brightness(1.2);
                box-sizing: content-box;
                background-color: $bg-color-0;
                border-left: 2px solid $highlight-color;
                color: $highlight-color;
            }
        }

        .no-conversation {
            display: flex;
            align-items: center;
            width: 100%;
            margin-top: 5px;
            height: 100%;
            color: gray;
        }
    }

    #view {
        flex: 2;
        height: 100%;
        overflow-y: auto;
    }
}
</style>