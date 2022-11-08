<template>
    <div id="conversation-list" :class="{ small: isSmall, medium: isMedium }">
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
                    <ProgChatConversationPicture :url="conversation.picture" />
                </div>
                <div class="info">
                    <div class="name">
                        {{ conversation.displayName }}
                    </div>
                    <div v-if="conversation.lastMessage" class="last-message"
                        :class="{ unread: conversation.lastMessage.isRead }">
                        {{ conversation.lastMessage.isMine ? 'Moi: ' : '' }}
                        {{ conversation.lastMessage.text }}
                    </div>
                </div>
                <div class="last-message-time" v-if="conversation.lastMessage">
                    {{ conversation.lastMessage.getReadableTime() }}
                </div>
            </div>
            <div v-if="conversations.length < 1">
                <div class="no-conversation">
                    Aucune conversation
                </div>
            </div>
        </div>
        <div id="view">
            <ProgChatConversationView :conversation="selectedConversation" :isSmall="isSmall" :isMedium="isMedium"
                @send="(msg) => $emit('send-message', msg)" @delete-selected-conversation="()=>$emit('delete-selected-conversation')"
                @load-more-messages="()=>$emit('load-more-messages')" @new-conversation="newConversation()"/>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ConversationList',
    components: {
        ProgChatConversationPicture: () => import('./ConversationPicture.vue'),
    },
    props: {
        conversations: {
            type: Array,
            default: () => [],
        },
        selectedConversationId: {
            type: String,
            default: null,
        },
        isSmall: {
            type: Boolean,
            default: false,
        },
        isMedium: {
            type: Boolean,
            default: false,
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
    watch: {
        isSmall() {
        },
        isMedium() {
        },
    }
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
            background-color: $bg-color-2;
            border-radius: $border-radius-sm;
            padding: 0 5px;
            cursor: pointer;
            color: $txt-color;
            transition: filter 0.2s ease-in-out;
            filter: brightness(0.8);

            &:hover {
                filter: brightness(1);
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
            transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out, border-left-width 0.1s ease-in-out;

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

    // on small, keep only the picture of the left list
    &.small {
        padding: 0;

        #list {
            min-width: 50px;
            max-width: 50px;
            padding: 0;
            align-items: center;

            .conversation {
                padding: 0;
                gap: 0px;
                border: 2px solid transparent;
                padding: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;

                .picture {
                    img {
                        width: 30px;
                        height: 30px;
                    }
                }

                .info {
                    display: none;
                }

                .last-message-time {
                    display: none;
                }

                .picture,
                .picture img {
                    width: 30px;
                    height: 30px;
                    transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
                }

                &.selected {
                    background-color: $bg-color-2;


                    .picture {
                        width: 34px;
                        height: 34px;

                        img {
                            width: 34px;
                            height: 34px;
                            border-radius: 50%;
                        }
                    }
                }
            }

            .new-conversation {
                border-radius: 50px;
                height: 30px;
                width: 30px;
                margin: 0;

                .name {
                    display: none;
                }

                .icon {
                    width: 20px;
                    height: 20px;
                    font-size: 15px;
                }
            }

            .no-conversation {
                display: none;
            }
        }
    }
}
</style>