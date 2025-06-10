import admin from 'firebase-admin';
import serviceAccount from './firebase.js';



export const firebaseadmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
