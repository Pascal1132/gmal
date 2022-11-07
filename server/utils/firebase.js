import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';


export const app = initializeApp({
    credential: cert('./service-account.json'),
    storageBucket: 'gs://g-mal-74a68.appspot.com',
})

export const firestore = getFirestore();
export const storageBucket = getStorage(app).bucket();
export const auth = getAuth(app);