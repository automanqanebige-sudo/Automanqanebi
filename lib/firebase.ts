import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    "AIzaSyBbN4ROdD_TAmmd4BmmzW6OLf8B3sv8S2M",

  authDomain:
    "aauuttooo-9c5e6.firebaseapp.com",

  projectId:
    "aauuttooo-9c5e6",

  storageBucket:
    "aauuttooo-9c5e6.firebasestorage.app",

  messagingSenderId:
    "212304817546",

  appId:
    "1:212304817546:web:7fecc147ca2cc43639ec73",
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);