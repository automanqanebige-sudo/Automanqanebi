import {
  type FirebaseApp,
  type FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";

function pickEnv(...names: string[]): string {
  for (const name of names) {
    const v = process.env[name];
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return "";
}

/** საჯარო კონფიგი — იგივე მნიშვნელობები რაც Firebase Console → Project settings → Your apps */
export function readFirebaseOptions(): FirebaseOptions {
  return {
    apiKey: pickEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "FIREBASE_API_KEY"),
    authDomain: pickEnv(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "FIREBASE_AUTH_DOMAIN",
    ),
    projectId: pickEnv(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "FIREBASE_PROJECT_ID",
    ),
    storageBucket: pickEnv(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "FIREBASE_STORAGE_BUCKET",
    ),
    messagingSenderId: pickEnv(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_MESSAGING_SENDER_ID",
    ),
    appId: pickEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "FIREBASE_APP_ID"),
  };
}

export function isFirebaseConfigured(): boolean {
  const o = readFirebaseOptions();
  return Boolean(
    o.apiKey &&
      o.authDomain &&
      o.projectId &&
      o.storageBucket &&
      o.messagingSenderId &&
      o.appId,
  );
}

let cachedApp: FirebaseApp | undefined;

/**
 * ინიციალიზაცია მხოლოდ პირველ გამოძახებაზე — `next build` არ ინგრევა ცარიელი env-ით,
 * სანამ რეალურად არ დაგჭირდება Firestore/Auth (მაშინ უნდა იყოს Vercel/.env მნიშვნელობები).
 */
export function getFirebaseApp(): FirebaseApp {
  if (cachedApp) return cachedApp;

  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const options = readFirebaseOptions();
  if (
    !options.apiKey ||
    !options.authDomain ||
    !options.projectId ||
    !options.storageBucket ||
    !options.messagingSenderId ||
    !options.appId
  ) {
    throw new Error(
      "Firebase არ არის სრულად კონფიგურირებული. Vercel → Settings → Environment Variables (ან .env.local): დაამატე ეს 6 მნიშვნელობა Firebase Console → Project settings → Your apps → SDK snippet (NEXT_PUBLIC_FIREBASE_* ან FIREBASE_*).",
    );
  }

  cachedApp = initializeApp(options);
  return cachedApp;
}
