import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, initializeFirestore, terminate } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Next.js-ისთვის მნიშვნელოვანია შევამოწმოთ, უკვე ხომ არ არის აპი ინიციალიზებული
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Storage-ისთვის
export const storage = getStorage(app);

// Firestore-ისთვის (სპეციალური პარამეტრით, რომელიც აგვარებს e.copy შეცდომას)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // ეს აგვარებს კავშირის პრობლემებს Vercel-ზე
});
