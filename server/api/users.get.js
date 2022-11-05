import { auth, firestore } from '../utils/firebase';

export default defineEventHandler(async (event) => {
    /*const user = event.context.user;

    if (!user) {
        return {};
    }*/

    // get the params from the request
    const { findBy, value, limit } = await getQuery(event);
    switch (findBy) {
        case 'displayName':
            // get the profile with displayName like value and limit to limit using firestore
            const ref = firestore.collection(`profiles`).where('displayName', '>=', value).where('displayName', '<=', value + '\uf8ff').limit(parseInt(limit));
            const snapshot = await ref.get();
            const data = snapshot.docs.map(doc => doc.data());
            // get the user from auth for each profile
            const users = await Promise.all(data.map(async (profile) => {
                const { uid, photoURL, displayName } = await auth.getUser(profile.userId);
                return {
                    uid,
                    photoURL,
                    displayName,
                };
            }));


            return users;
        default:
            return [];

    }

});