import { firestore } from '../utils/firebase';

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const ref = firestore.collection(`themes`).doc(user?.uid);
    const snapshot = await ref.get();
    const data = snapshot.data();
    
    return data;
});