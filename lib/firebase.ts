import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "აქ შენი apiKey",

  authDomain: "აქ authDomain",

  projectId: "აქ projectId",

  storageBucket: "აქ storageBucket",

  messagingSenderId: "აქ messagingSenderId",

  appId: "აქ appId",

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;