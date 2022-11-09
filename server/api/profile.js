import { firestore } from '../utils/firebase';

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const body = await readBody(event);
    const method = await getMethod(event);
    if (!user) {
        // return error 401 if user is not authenticated
        const response = {
            status: 401,
            message: 'Must be signed in'
        }
        return response;
    }

    let ref, snapshot, data;
    switch (method) {
        case 'GET':
            ref = firestore.collection(`profiles`).doc(user?.uid);
            snapshot = await ref.get();
            data = snapshot.data();

            return data;
        case 'POST':
            ref = firestore.collection(`profiles`).doc(user?.uid);
            // if user doesnt have a profile, create one
            await ref.set(body, { merge: true });
            return snapshot;
    }
    return null;
});