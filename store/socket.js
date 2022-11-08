import { getAuth } from 'firebase/auth';
import { defineStore } from 'pinia'
import io from 'socket.io-client'
import WsEvent from '~~/server/models/ws_event';
import { useChatStore } from './chat';

export const useSocketStore = defineStore({
    id: 'socket',
    state: () => ({
        socket: null,
        connectedWithUser: false,
    }),
    getters: {
        getSocket() {
            return this.socket;
        },
    },
    actions: {
        // set theme with update to api
        async connect() {
            // close previous connection if exists
            if (this.socket) {
                this.socket.close();
            }
            this.socket = io();

            this.socket.on('connect', async () => {
                // Send a message to the server to identify this client
                this.socket.emit('identity', {
                    id: 'client',
                    type: 'client',
                    auth: getAuth().currentUser,
                });
            });

            this.socket.on('disconnect', () => {
                console.log('disconnected');
            });

            this.socket.on('message', (message) => {
                useChatStore().receiveMessage(message);
            });

            this.socket.on(WsEvent.TYPES.NEW_CONVERSATION, (conversation) => {
                useChatStore().onNewConversation(conversation);
            });

            this.socket.on(WsEvent.TYPES.DELETE_CONVERSATION, (conversationId) => {
                useChatStore().onDeleteConversation(conversationId);
            });

            // on identity response
            this.socket.on('identity', (msg) => {
                console.log('identity', msg);
                this.connectedWithUser = msg?.success || false;
            });

            this.socket.on('init', (init) => {
                useChatStore().onInitFromSocket(init);
            });
        },
        async send(message, type = WsEvent.TYPES.MESSAGE) {
            const firebaseUser = useFirebaseUser();
            const event = new WsEvent({
                userId: firebaseUser?.value?.uid || null,
                type: type,
                data: message,
                createdAt: new Date(),
            });

            this.socket.emit('message', event);
        },
        disconnect() {
            this.socket.disconnect();
        }
    },
});