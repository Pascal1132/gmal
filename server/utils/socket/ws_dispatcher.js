import WsEvent from "~~/server/models/ws_event";
import MessageHandler from "./handlers/message_handler";
import UserHandler from "./handlers/user_handler";
export class WSHandler {
    constructor() {
        this.connections = [];
        this.userHandler = new UserHandler(this);
        this.messageHandler = new MessageHandler(this);
    }

    async initConnection(sock) {
        const messageInit = await this.messageHandler.initConnection(sock);
        const init = {
            ...messageInit,
        };
        sock.emit('init', init);
        this.connections.push(sock);
    }
    handle(event, sock) {
        switch (event.type) {
            case WsEvent.TYPES.MESSAGE:
                this.messageHandler.handleMessage(event, sock);
                break;
            case WsEvent.TYPES.NEW_CONVERSATION:
                this.messageHandler.handleNewConversation(event, sock);
                break;
            case WsEvent.TYPES.NEW_MESSAGE:
                this.messageHandler.handleNewMessage(event, sock);
                break;
            default:
                break;
        }
    }
    async identity(msg, sock) {
        sock.emit('identity', {
            success: await this.userHandler.handleIdentity(msg, sock),
        });
        // reinit connection
        await this.initConnection(sock);
    }
    onDisconnect(sock) {
        this.connections = this.connections.filter((c) => c !== sock);
    }

    broadcast(event, type = 'message', exclude = [], include = []) {
        this.connections.forEach((sock) => {
            if (!(sock.user) || (include.length > 0 && !include.includes(sock.user.uid)) || exclude.includes(sock.user.uid)) {
                return;
            }
            // add uid to exclude list
            exclude.push(sock.user.uid);
            sock.emit(type, event);
        });
    }

    checkIfIdentified(sock) {
        return !!(sock.user?.uid);
    }
}