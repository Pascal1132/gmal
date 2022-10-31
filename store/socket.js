import { defineStore } from 'pinia'
import io from 'socket.io-client'
import WsEvent from '~~/server/models/ws_event';

export const useSocketStore = defineStore({
    id: 'socket',
    state: () => ({
        socket: null,
        messages: [],
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

            this.socket.on('connect', () => {
                console.log('connected');
            });

            this.socket.on('disconnect', () => {
                console.log('disconnected');
            });

            this.socket.on('message', (message) => {
                this.messages.push(message);
            });

            this.socket.on('init', (init) => {
                this.messages = init.messages;
            });
        },
        async send(message) {
            const firebaseUser = useFirebaseUser();
            const event = new WsEvent({
                userId: firebaseUser?.value?.uid || null,
                type: 'message',
                data: message,
                createdAt: new Date(),
            });
            console.log(this.socket.emit('message', event));
        },
        disconnect() {
            this.socket.disconnect();
        }
    },
});