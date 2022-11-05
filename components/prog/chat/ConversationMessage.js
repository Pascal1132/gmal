export default class ConversationMessage {
    constructor(id, text, createdAt, isMine = true, isOnline = false, isRead = false) {
        this.id = id;
        this.text = text;
        this.createdAt = createdAt;
        this.isMine = isMine;
        this.isOnline = isOnline;
        this.isRead = isRead;
    }

    getReadableTime() {
        return getRelativeTime(this.createdAt);
    }
}