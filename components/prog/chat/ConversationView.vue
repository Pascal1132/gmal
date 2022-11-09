<template>
    <div class="full-height">
        <div id="conversation-view" v-if="isConversationSelected">
            <div class="conversation-header">
                <div class="name">{{ conversation.displayName }}</div>
                <div class="actions" @click="onEllipsisActionClick">
                    <div class="action">
                        <fa :icon="['fas', 'ellipsis-vertical']" />
                    </div>
                </div>
            </div>
            <PopupMenu :showMenu="showMenu" :pos="menuPos">
                <div id="conversation-actions">
                    <div class="content">
                        <ul>
                            <li v-for="item in menuItems" :key="item.id" @click="item.handleClick" :style="item.style">
                                {{ item.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </PopupMenu>
            <div class="messages" ref="messagesContainer" @scroll="onMessageContainerScroll">

                <div class="loading-more" v-if="thereIsNotTheLastMessageInMessages">
                    <div class="loading-more-message">
                        Chargement des messages
                        <span class="spin">
                            <fa :icon="['fas', 'sync']" />
                        </span>
                    </div>
                </div>
                <div class="message-group" v-for="(group, index) of messagesByGroup" :key="index">
                    <div class="date">
                        {{ group[0].getReadableTime() }}
                    </div>
                    <div class="message" v-for="message of group" :key="message.id" :class="{ me: message.isMine }"
                        :data-number="message.number">
                        <div class="content">
                            <div class="text">
                                {{ message.text }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="arrow" :class="{ show: showArrow }" @click="onArrowDownClick">
                    Nouveau message
                    <fa :icon="['fas', 'arrow-down']" />
                </div>
            </div>
            <div v-if="!haveMessages">
                <div class="no-message">
                    Aucun message
                </div>
            </div>

            <div class="send-message">
                <input type="text" v-model="msg" placeholder="Tapez votre message" @keyup.enter="send">
                <div class="send" @click="send">
                    <fa :icon="['fas', 'paper-plane']" />
                </div>
            </div>
        </div>
        <div v-else id="welcome-to-chat">
            <h1>
                Bienvenue dans le chat
            </h1>
            <p>Désires tu commencer une conversation ?</p>
            <div class="button" @click="$emit('new-conversation')">
                Nouvelle conversation
                <fa :icon="['fas', 'plus']" />
            </div>
        </div>
    </div>
</template>
<script>
import MessageStatusIcon from './MessageStatusIcon.vue';

export default {
    name: "ConversationView",
    props: {
        conversation: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            msg: "",
            showMenu: false,
            menuPos: {
                top: 90,
                right: 5,
                left: null,
                bottom: null,
            },
            menuItems: [
                {
                    id: 1,
                    name: "Supprimer la conversation",
                    handleClick: () => {
                        this.$emit("delete-selected-conversation");
                    },
                    style: {
                        color: "var(--danger-color)",
                    },
                },
            ],
            listener: null,
            isAtBottomScroll: true,
            showArrow: false,
            prevFirstNumber: null,
            prevFirstNumberOffset: null,
            prevConversationId: null,
        };
    },
    mounted() {
        this.listener = document.addEventListener("click", (e) => {
            if (this.showMenu) {
                this.showMenu = false;
            }
        });
        this.prevConversationId = this.conversation?.id;

    },
    beforeDestroy() {
        document.removeEventListener("click", this.listener);
    },
    methods: {
        send() {
            if (this.msg) {
                this.$emit("send", this.msg);
                this.msg = "";
            }
        },
        onEllipsisActionClick(e) {
            e.stopPropagation();
            this.showMenu = true;
        },
        onMessageContainerScroll(e) {
            const container = e.currentTarget;
            this.isAtBottomScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

            if (this.isAtBottomScroll) {
                this.showArrow = false;
            }

            // if it is a the top and there is not the last message in the messages, we load more messages
            if (container.scrollTop === 0 && this.thereIsNotTheLastMessageInMessages) {
                this.loadMoreMessages();
            }
        },
        onArrowDownClick() {
            this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
            this.showArrow = false;
        },
        async loadMoreMessages() {
            this.prevFirstNumber = this.messages[0]?.number || null;
            // offset is the height of the first message
            this.prevFirstNumberOffset = this.$refs.messagesContainer.querySelector(".message")?.offsetHeight || null;
            this.$emit("load-more-messages");
        },
    },
    computed: {
        messages() {
            return this.conversation?.getMessages() || [];
        },
        haveMessages() {
            return this.messages.length > 0;
        },
        isConversationSelected() {
            return this.conversation !== null;
        },
        thereIsNotTheLastMessageInMessages() {
            return (this.messages[0]?.number || 1) !== 1;
        },
        conversationId() {
            return this.conversation?.id;
        },
        // get the message by group of closest timestamp (5 minutes between each message)
        messagesByGroup() {
            const groups = [];
            let currentGroup = [];
            let lastTimestamp = null;
            for (const message of this.messages) {
                if (lastTimestamp === null || message.createdAt - lastTimestamp < 5 * 60 * 1000) {
                    currentGroup.push(message);
                } else {
                    groups.push(currentGroup);
                    currentGroup = [message];
                }
                lastTimestamp = message.createdAt;
            }
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            return groups;
        },

    },
    // watch new messages deep to scroll to the bottom
    watch: {
        messages: {
            handler() {
                this.$nextTick(() => {
                    if (this.prevConversationId !== this.conversation?.id || !this.isConversationSelected) {
                        return;
                    }
                    // if the old first message is not the same as the new one, it means that we have loaded more messages
                    // so we don't want to scroll to the bottom
                    if (this.prevFirstNumber !== this.messages[0]?.number) {
                        // get the new offset of the previous first message
                        const oldFirstMessage = this.$refs.messagesContainer.querySelector(
                            `[data-number="${this.prevFirstNumber}"]`
                        );
                        const newOffset = oldFirstMessage?.offsetTop || 0;
                        // scroll to the new offset
                        this.$refs.messagesContainer.scrollTop = newOffset - this.prevFirstNumberOffset - 10;

                        this.prevFirstNumber = this.messages[0]?.number;
                        this.prevFirstNumberOffset = null;
                        return;
                    }
                    if (this.isAtBottomScroll) {
                        const container = this.$refs.messagesContainer;
                        container.scrollTop = container.scrollHeight;
                        return;
                    }
                    this.showArrow = true;
                });
            },
            deep: true,
        },
        conversationId: {
            handler() {
                if (this.prevConversationId !== this.conversationId) {
                    this.$nextTick(() => {
                        this.prevFirstNumber = this.messages[0]?.number || null;
                        const container = this.$refs.messagesContainer;
                        if (container) {
                            container.scrollTop = container.scrollHeight;
                        }
                        this.prevConversationId = this.conversationId;
                        this.$nextTick(() => {
                            this.showArrow = false;
                        });
                    });
                }
            },
            deep: true,
        },
    },
    components: { MessageStatusIcon }
}
</script>
<style lang="scss">
#conversation-view {
    height: 100%;
    overflow-y: auto;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .conversation-header {
        padding: 10px;
        font-size: 1.2em;
        font-weight: bold;
        background-color: $bg-color-2;

        .name {
            display: inline-block;
            width: calc(100% - 30px);
        }

        .actions {
            display: inline-block;
            padding: 5px 10px;
            text-align: center;
            cursor: pointer;
            transition: color 0.2s ease-in-out;

            &:hover {
                color: $highlight-color;
            }
        }
    }

    #conversation-actions {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .messages {
        flex-direction: column;
        display: flex;
        flex: 1;
        overflow-y: auto;
        padding-left: 15px;
        justify-content: baseline;
        position: relative;
        align-items: flex-start;
        width: 100%;

        .loading-more {
            width: 100%;
            text-align: center;
            margin: 10px 0;

            .loading-more-message {
                color: $txt-color;
                filter: brightness(0.5);

                .spin svg {
                    margin-left: 5px;
                    animation: spin 3s linear infinite;
                }
            }
        }

        .arrow {
            display: none;
            position: sticky;
            bottom: 10px;
            left: calc(50% - 100px);
            background-color: $bg-color-2;
            width: 200px;
            text-align: center;
            padding: 10px 0;
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
            transform: translateY(100px);
            opacity: 0;

            cursor: pointer;
            transition: color 0.2s ease-in-out;

            &:hover {
                color: $highlight-color;
            }

            &.show {
                transform: translateY(0);
                display: block;
                opacity: 1;
            }
        }
    }

    .message-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin-bottom: 10px;
        padding: 0 5px;

        .date {
            width: 100%;
            text-align: center;
            font-size: 0.8em;
            color: $txt-color;
            filter: brightness(0.5);
            margin: 5px 0;
        }

        .message {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            margin: 5px 0;
            gap: 5px;

            &.me {
                align-self: flex-end;
                align-items: flex-end;

                .content {
                    .text {
                        background-color: $bg-color-0;
                    }
                }
            }

                .picture {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .content {
                    display: flex;
                    color: $txt-color;

                    .text {
                        background-color: $bg-color-2;
                        padding: 10px;
                        border-radius: 10px;
                    }

                    .time {
                        font-size: 12px;
                        color: #999;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding: 5px;
                    }
                }
            }
        }

        .no-message {
            height: 100%;
            font-size: 15px;
            padding: 10px;
            color: #999;
        }

        .send-message {
            display: flex;
            align-items: center;
            padding: 10px;

            input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                outline: none;
            }

            .send {
                margin-left: 10px;
                cursor: pointer;
                color: #999;
            }
        }
    }

    .full-height {
        height: 100%;
    }

    #welcome-to-chat {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: $txt-color;
        filter: brightness(0.8);
        padding: 10px;

        h1 {
            font-size: 1.5em;
            font-weight: bold;
        }

        p {
            text-align: center;
            font-size: 1.2em;
        }

        .button {
            margin-top: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            background-color: $bg-color-0;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;

            &:hover {
                background-color: $bg-color-1;
            }
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>