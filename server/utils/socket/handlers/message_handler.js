import WsEvent from '~~/server/models/ws_event.js';
import { firestore } from '../../firebase.js';


export default class MessageHandler {
    constructor(dispatcher) {
        this.messages = [];
        this.dispatcher = dispatcher;
    }

    async initConnection(sock) {
        if (sock.user) {
            const conversations = await this.fetchConversationList(sock.user.uid, true, true, true);

            return {
                messages: this.messages,
                conversations: conversations,
            };
        }
        return {
            messages: [],
            conversations: [],
        };
    }

    async handleNewMessage(event, sock) {
        if (!this.dispatcher.checkIfIdentified(sock)) return;
        event.data.from = sock.user.uid;
        const msg = event.data;

        const conversation = (await firestore.collection('conversations').doc(msg.conversationId).get()).data();
        if (!conversation) {
            return;
        }

        // Check if the user is in the conversation and the conversation is not deleted
        if (!conversation.users.includes(sock.user.uid) || conversation.isDeleted) {
            return;
        }

        // fetch last message to get the last message number
        const prevMessage = (await MessageHandler.fetchLastMessages(msg.conversationId, 1, 0))[0] || null;
        msg.number = prevMessage?.number + 1 || 1;

        const simpleMsg = {
            conversationId: msg.conversationId,
            from: msg.from,
            content: msg.content,
            createdAt: Date.parse(event.createdAt),
            isRead: false,
            number: msg.number
        };

        // create a new document in the messages collection
        firestore.collection('messages').add(simpleMsg);
        // send the message to the users
        this.dispatcher.broadcast(simpleMsg, WsEvent.TYPES.MESSAGE, [], conversation.users);
    }

    static async securityCheck(conversationId, userId) {
        const conversation = (await firestore.collection('conversations').doc(conversationId).get()).data();
        if (!conversation) {
            return false;
        }

        // Check if the user is in the conversation and the conversation is not deleted
        if (!conversation.users.includes(userId) || conversation.isDeleted) {
            return false;
        }
        return true;
    }

    async handleNewConversation(event, sock) {
        // fetch user from event.userId if setted from firebase
        let user = null;
        if (event.data.uid) {
            user = await this.dispatcher.userHandler.getUser(event.data.uid);
        }
        // TODO: add multiple users
        const conversation = {
            users: [sock.user.uid, user.uid],
        };

        // Foreach user in the conversation, add the conversation to the user's conversation list
        const conversations = await this.fetchConversationList(sock.user.uid, true);
        const isConversationAlreadyExists = conversations.find((c) => {
            return c.users === conversation.users;
        });
        if (isConversationAlreadyExists) {
            return;
        }
        // add the conversation to firestore
        const docRef = await firestore.collection('conversations').add(conversation);
        // get the conversation id
        const conversationId = docRef.id;

        // update all other users in the conversation
        conversation.users.forEach(async (userId) => {
            const conversations = await this.fetchConversationList(userId, false);
            conversations.push(conversationId);
            this.dispatcher.userHandler.updateProfile(userId, { conversations: conversations });
        });

        const fullPackage = await this.unionUsersWithConversation(conversation);
        fullPackage.id = conversationId;

        // send a new conversation event to the users
        this.dispatcher.broadcast(fullPackage, WsEvent.TYPES.NEW_CONVERSATION, [], conversation.users);
    }

    async fetchConversationList(userId, withBundle = false, withUsers = false, withLatestMessages = false) {
        const list = (await this.dispatcher.userHandler.fetchProfile(userId))?.conversations || [];
        if (withBundle) {
            // get the conversation corresponding to the conversation id
            let conversations = await Promise.all(list.map(async (conversationId) => {
                const conversation = await firestore.collection('conversations').doc(conversationId).get();
                return {...conversation.data(), id: conversation.id};
            })) || [];
            if (withUsers) {
                // union the conversation with the users 
                conversations = await Promise.all(conversations.map(async (conversation) => await this.unionUsersWithConversation(conversation)));
            }
            if (withLatestMessages) {
                // get the latest messages
                conversations = await Promise.all(conversations.map(async (conversation) => await this.unionMessagesWithConversation(conversation)));
            }
            return conversations;
        }
        return list;
    }

    async unionUsersWithConversation(conversation) {
        const userList = conversation?.users || [];
        const users = await Promise.all(userList.map(async (userId) => {
            const profile = await this.dispatcher.userHandler.fetchProfile(userId);
            const user = await this.dispatcher.userHandler.getUser(userId);
            return {
                uid: user.uid,
                displayName: profile.displayName,
                photoURL: user.photoURL
            };
        }));
        return {
            ...conversation,
            users,
        };
    }

    async unionMessagesWithConversation(conversation, limit = 10, offset = 0) {
        const messages = await MessageHandler.fetchLastMessages(conversation.id, limit, offset);
        return {
            ...conversation,
            messages: messages.reverse(),
        };
    }

    static async fetchLastMessages(conversationId, limit = 10, offset = 0) {
        const messages = await firestore.collection('messages').where('conversationId', '==', conversationId).orderBy('createdAt', 'desc').limit(limit).offset(offset).get();
        return messages.docs.map((doc) => doc.data());
    }

    // method handleDeleteConversation delete the conversation from the list of all users in the conversation and set isDeleted to true in the conversation
    async handleDeleteConversation(event, sock) {
        if (!this.dispatcher.checkIfIdentified(sock)) return;
        const conversationId = event.data.conversationId;
        const conversation = (await firestore.collection('conversations').doc(conversationId).get()).data();
        // update the conversation
        firestore.collection('conversations').doc(conversationId).update({ isDeleted: true });
        // update all users in the conversation
        conversation.users.forEach(async (userId) => {
            const conversations = await this.fetchConversationList(userId, false);
            const index = conversations.indexOf(conversationId);
            if (index > -1) {
                conversations.splice(index, 1);
            }
            this.dispatcher.userHandler.updateProfile(userId, { conversations: conversations });
        });
        // send a delete conversation event to the users
        this.dispatcher.broadcast(event.data, WsEvent.TYPES.DELETE_CONVERSATION, [], conversation.users);
    }
}