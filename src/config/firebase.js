import admin from "firebase-admin";

// console.log("FIREBASE_SERVICE_ACCOUNT: ------", process.env);
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();
