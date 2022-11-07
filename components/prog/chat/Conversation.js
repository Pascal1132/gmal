import { getAuth } from "firebase/auth";
import ConversationMessage from "./ConversationMessage";

export default class Conversation {
    constructor(id, displayName, picture, lastMessage, isOnline) {
        this.id = id;
        this.displayName = displayName;
        this.picture = picture;
        this.lastMessage = lastMessage;
        this.isOnline = isOnline;
        this.messages = [];
        this.draftMessage = '';
    }
    
    addMessage(message) {
        this.messages.push(message);
        this.lastMessage = message;
        this.draftMessage = '';
    }

    getMessages() {
        return this.messages;
    }

    static fromSocket(data) {
        const users = data.users;
        const messages = data?.messages || [];
        // get the other user
        const dataFromUser = users.find((u) => u.uid !== getAuth().currentUser.uid) || users[0];
        if (!dataFromUser) {
            return null;
        }
        const conversation = new Conversation(
            data.id,
            dataFromUser.displayName,
            dataFromUser.photoURL,
            data.lastMessage ? data.lastMessage : null,
            true,
        );

        conversation.messages = messages.map((m) => new ConversationMessage(
            m.createdAt,
            m.content,
            m.createdAt,
            m.from === getAuth().currentUser.uid,
            true,
            m.isRead || false,
            m.number,
        ));
        // set last message
        if (conversation.messages.length > 0) {
            conversation.lastMessage = conversation.messages[conversation.messages.length - 1];
        }
        return conversation;
    }

    resetLastMessage(message) {
        // if last message is mine, remove it
        if (this.lastMessage && this.lastMessage.isMine) {
            this.lastMessage = message;
            this.messages[this.messages.length - 1] = message;
        } else {
            // find the messagethat is mine, the same content, and not sent
            const index = this.messages.findIndex((m) => m.isMine && m.content === message.content && !m.isOnline);
            if (index !== -1) {
                this.messages[index] = message;
            }
        }

        
    }
}