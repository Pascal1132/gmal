export default class WsEvent {
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
        console.log(ev.userId);
        return ev;
    }
}