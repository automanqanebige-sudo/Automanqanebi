import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "./firebase-app";

export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
