export default class ConversationMessage {
    constructor(id, text, createdAt, isMine = true, isOnline = false, isRead = false, number = 1) {
        this.id = id;
        this.text = text;
        this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
        this.isMine = isMine;
        this.isOnline = isOnline;
        this.isRead = isRead;
        this.number = number;
    }

    getReadableTime(full = true) {
        return getRelativeTime(this.createdAt, full);
    }
}