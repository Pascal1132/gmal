import WsEvent from '~~/server/models/ws_event.js';
import { firestore } from '../../firebase.js';


export default class MessageHandler {
    constructor(dispatcher) {
        this.messages = [];
        this.dispatcher = dispatcher;
    }

    async initConnection(sock) {
        if (sock.user) {
            const conversations = await this.fetchConversationList(sock.user.uid, true, true);
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
        const simpleMsg = {
            conversationId: msg.conversationId,
            from: msg.from,
            content: msg.content,
            createdAt: event.createdAt,
        };
        const conversation = (await firestore.collection('conversations').doc(msg.conversationId).get()).data();
        // add the message to the conversation
        const messages = conversation?.messages || [];
        // add the message
        messages.push(simpleMsg);
        // update the conversation
        firestore.collection('conversations').doc(msg.conversationId).update({ messages: messages });
        // send the message to the users
        this.dispatcher.broadcast(simpleMsg, WsEvent.TYPES.MESSAGE, [], conversation.users);
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

    async fetchConversationList(userId, withBundle = false, withUsers = false) {
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
}