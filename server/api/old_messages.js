import { firestore } from '../utils/firebase';
import MessageHandler from '../utils/socket/handlers/message_handler';

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    if (!user) {
        return {};
    }

    const { conversationId, offset } = getQuery(event);
    if (!MessageHandler.securityCheck(conversationId, user.uid)) {
        return {};
    }
    const messages = await MessageHandler.fetchLastMessages(conversationId, 10, parseInt(offset));
    return messages.reverse();
});