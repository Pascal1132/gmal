<template>
    <div id="conversation-view" v-if="isConversationSelected">
        <div class="conversation-header">
            <div class="name">{{conversation.displayName}}</div>
            <div class="actions">
                <div class="action" >
                    <fa :icon="['fas', 'ellipsis-vertical']" />
                </div>
            </div>
        </div>
        <div class="messages">
            <div class="message" v-for="message of messages" :key="message.id" :class="{ me: message.isMine }">
                <div class="content">
                    <div class="text">
                        {{ message.text }}
                    </div>
                    <div class="time">
                        {{ message.getReadableTime() }} <MessageStatusIcon :message="message" />
                    </div>
                </div>
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
</template>
<script>
import { fa0 } from '@fortawesome/free-solid-svg-icons';
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
        };
    },
    methods: {
        send() {
            if (this.msg) {
                this.$emit("send", this.msg);
                this.msg = "";
            }
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
    },
    watch: {
        conversation() {
            this.msg = this.conversation?.draftMessage || "";
        },
    },
    components: { MessageStatusIcon, fa0 }
}
</script>
<style lang="scss" scoped>
#conversation-view {
    height: 100%;
    overflow-y: auto;
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
            width: calc(100% - 50px);
        }

        .actions {
            display: inline-block;
            width: 50px;
            padding-right: 5px;
            text-align: right;

            .action {
                cursor: pointer;
            }
        }
    }

    .messages {
        flex-direction: column;
        display: flex;
        flex: 1;
        overflow-y: auto;
        padding-left: 15px;
        justify-content: baseline;
        align-items: flex-start;
        width: 100%;
    }

    .message {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin: 10px 0;
        gap: 5px;

        &.me {
            align-self: flex-end;
            align-items: flex-end;
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
                background-color: $bg-color-0;
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
</style>