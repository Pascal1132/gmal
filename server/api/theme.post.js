import { firestore, storageBucket } from '../utils/firebase';

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const body = await readBody(event);    
    // if body.bgData is not null, then we need to create a new file in firebase storage
    if (body.bgData) {
        // get the extension from the data base64 string
        const extension = body.bgData.split(';')[0].split('/')[1];
        // create a new file in firebase storage
        const file = storageBucket.file(`backgrounds/${user.uid}.${extension}`);
        const background = await fetch(body.bgData);
        const buffer = await background.buffer(); // TODO: change this to array buffer
        await file.save(buffer);
        // get the public url of the file
        const url = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491',
        });

        body.bgData = null;
        body.bg = `url(${url})`;
    }

    const ref = firestore.collection(`themes`).doc(user?.uid);
    const snapshot = await ref.set(body);

    return snapshot;
});