import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "შენი apiKey",
  authDomain: "შენი domain",
  projectId: "შენი projectId",
  storageBucket: "შენი bucket",
  messagingSenderId: "შენი senderId",
  appId: "შენი appId",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);