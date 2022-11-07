export default class WsEvent {
    static TYPES = {
        MESSAGE: 'message',
        NEW_CONVERSATION: 'new-conversation',
        NEW_MESSAGE: 'new-message',
        DELETE_CONVERSATION: 'delete-conversation',
    };

    // properties: raw, userId, type, data, createdAt
    constructor(data) {
        this.raw = data?.raw || data;
        this.userId = data.userId;
        this.type = data.type;
        this.data = data.data;
        this.createdAt = data.createdAt;
    }

    static createFromMessage(msg) {
        const ev = new WsEvent(msg);
        return ev;
    }
}