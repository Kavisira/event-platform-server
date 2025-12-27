import admin from "firebase-admin";

let db;
let auth;

export function initFirebase() {
  if (admin.apps.length) return;

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT missing");
    return;
  }

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
  auth = admin.auth();

  console.log("✅ Firebase initialized");
}

export { db, auth };
