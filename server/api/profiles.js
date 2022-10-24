import { firestore } from '../utils/firebase';

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const body = await readBody(event);

    if (!user) {
        // return error 401 if user is not authenticated
        const response = {
            status: 401,
            message: 'Must be signed in'
        }
        return response;
    }
    
    let ref, snapshot, data;
    switch (event.method) {
        case 'GET':
            console.log('GET');
             ref = firestore.collection(`profiles`).doc(user?.uid);
             snapshot = await ref.get();
             data = snapshot.data();

            return data;
        case 'POST':
             ref = firestore.collection(`profiles`).doc(user?.uid);             
             snapshot = await ref.set(body);
            return snapshot;
    }
    return null;
});