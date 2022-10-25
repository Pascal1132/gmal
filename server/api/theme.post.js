import { firestore } from '../utils/firebase';

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const body = await readBody(event);

    const ref = firestore.collection(`themes`).doc(user?.uid);
    const snapshot = await ref.set(body);

    return snapshot;
});