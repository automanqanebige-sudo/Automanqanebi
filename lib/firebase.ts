import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "შენი apiKey",
  authDomain: "შენი authDomain",
  projectId: "შენი projectId",
  storageBucket: "შენი storageBucket",
  messagingSenderId:
    "შენი messagingSenderId",
  appId: "შენი appId",
};

const app =
  initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db =
  getFirestore(app);