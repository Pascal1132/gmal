export default class MessageHandler{
    constructor(dispatcher) {
        this.messages = [];
        this.dispatcher = dispatcher;
    }

    initConnection(sock) {
        return this.messages;
    }

    async handleMessage(event, sock) {
        // fetch user from event.userId if setted from firebase
        let user = null;
        if (event.userId) {
            user = await this.dispatcher.userHandler.getUser(event.userId);
        }
        event.data = {
            text: event.data,
            username: user?.displayName || 'Anonymous',
        };
        this.messages.push(event);
        this.dispatcher.connections
            .forEach((c) => c.emit('message', event));
    }
}