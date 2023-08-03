import { getAuth } from 'firebase/auth';
import { defineStore } from 'pinia'
import Conversation from '~~/components/prog/chat/Conversation';
import ConversationMessage from '~~/components/prog/chat/ConversationMessage';
import { useNotificationsStore } from './notifications';

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        conversations: [],
    }),
    actions: {
        async onInitFromSocket(init) {
            this.conversations = init.conversations.map((c) => Conversation.fromSocket(c)).filter((c) => c);
            if (this.conversations.length < 2) {
                return;
            }
            // sort conversations by last message (newest first) and if there is no created at date, put it at the end
            this.conversations.sort((a, b) => {
                if (a.lastMessage && b.lastMessage) {
                    return b.lastMessage.createdAt - a.lastMessage.createdAt;
                }
                if (a.lastMessage) {
                    return -1;
                }
                if (b.lastMessage) {
                    return 1;
                }
                return 0;
            });
        },
        async receiveMessage(message) {
            const conversation = this.conversations.find((c) => c.id === message.conversationId);
            if (conversation) {
                const temp = new ConversationMessage(
                    message.createdAt,
                    message.content,
                    message.createdAt,
                    message.from === getAuth().currentUser.uid,
                    true,
                    message.number,
                );
                // if the temp message is equal to the last message, don't add it
                if (conversation.lastMessage.isOnline && conversation.lastMessage.number == temp.number && conversation.lastMessage.createdAt == temp.createdAt) {
                    return;
                }
                if (temp.isMine && conversation.lastMessage?.number == null) {
                    // remove the last message
                    conversation.resetLastMessage(temp);
                } else {
                    conversation.addMessage(
                        temp
                    );

                    useNotificationsStore().addNotification({
                        html: `<div style="display: flex; gap: 5px; align-items:center"><img height="30" style="border-radius: 5px; margin: 0 5px" src="${conversation.picture}"/><strong>${conversation.displayName}</strong>: ${temp.text}</div>`,
                    });
                }
            }
            // Set this conversation as the first one
            const index = this.conversations.findIndex((c) => c.id === message.conversationId);
            if (index !== -1) {
                const conversation = this.conversations[index];
                this.conversations.splice(index, 1);
                this.conversations.unshift(conversation);
            }
            
        },
        async onNewConversation(conversation) {
            // check if the new conversation is not already in the list
            const index = this.conversations.findIndex((c) => c.id = conversation.id);
            if (index == -1) {
                // add it to the list
                this.conversations.unshift(conversation);
            }
        },
        async onDeleteConversation({conversationId}) {
            const index = this.conversations.findIndex((c) => c.id === conversationId);
            if (index !== -1) {
                this.conversations.splice(index, 1);
            }
        },
        async fetchOldMessages(conversationId) {
            const conversation = this.conversations.find((c) => c.id === conversationId);
            if (conversation) {
                const messages = await firestoreFetch('old_messages?conversationId=' + conversationId + '&offset=' + conversation.messages.length, true);
                // add to the beginning instead of the end
                conversation.messages = messages.map((m) => new ConversationMessage(
                    m.createdAt,
                    m.content,
                    m.createdAt,
                    m.from === getAuth().currentUser.uid,
                    true,
                    m.isRead || false,
                    m.number,
                )).concat(conversation.messages);
            }
        }
    },
});