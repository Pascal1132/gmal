import MessageHandler from "./handlers/message_handler";
import UserHandler from "./handlers/user_handler";
export class WSHandler {
    constructor() {
        this.connections = [];
        this.userHandler = new UserHandler(this);
        this.messageHandler = new MessageHandler(this);
    }

    initConnection(sock) {
        const messageInit = this.messageHandler.initConnection(sock);
        const init = {
            messages: messageInit,
        };
        sock.emit('init', init);
        this.connections.push(sock);
    }
    handle(event, sock) {
        switch (event.type) {
            case 'message':
                this.messageHandler.handleMessage(event, sock);
                break;
            default:
                break;
        }
    }
    onDisconnect(sock) {
        this.connections = this.connections.filter((c) => c !== sock);
    }
}