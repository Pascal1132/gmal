import { getAuth } from 'firebase/auth';
import { defineStore } from 'pinia'
import Conversation from '~~/components/prog/chat/Conversation';
import ConversationMessage from '~~/components/prog/chat/ConversationMessage';

export const useChatStore = defineStore({
    id: 'chat',
    state: () => ({
        conversations: [],
    }),
    actions: {
        async onInitFromSocket(init) {
            this.conversations = init.conversations.map((c) => Conversation.fromSocket(c));
        },
        async receiveMessage(message) {
            const conversation = this.conversations.find((c) => c.id === message.conversationId);
            if (conversation) {
                const temp = new ConversationMessage(
                    message.createdAt,
                    message.content,
                    message.createdAt,
                    message.from === getAuth().currentUser.uid,
                    true
                );
                if (temp.isMine) {
                    // remove the last message
                    conversation.resetLastMessage(temp);
                } else {
                    conversation.addMessage(
                        temp
                    );
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
            this.conversations.push(Conversation.fromSocket(conversation));
        }
    },
});