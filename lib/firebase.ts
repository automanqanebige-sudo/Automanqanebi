import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// შენი Firebase კონფიგურაცია
const firebaseConfig = {
  apiKey: "AIzaSyBbN4ROdD_TAmmd4BmmzW6OLf8B3sv8S2M",
  authDomain: "aauuttooo-9c5e6.firebaseapp.com",
  projectId: "aauuttooo-9c5e6",
  storageBucket: "aauuttooo-9c5e6.firebasestorage.app",
  messagingSenderId: "212304817546",
  appId: "1:212304817546:web:7fecc147ca2cc43639ec73",
};

// ინიციალიზაცია (ამოწმებს უკვე ჩართულია თუ არა აპლიკაცია)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// სერვისების ექსპორტი
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
