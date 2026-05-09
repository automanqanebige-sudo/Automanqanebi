import { type Firestore, getFirestore } from "firebase/firestore/lite";
import { type FirebaseStorage, getStorage } from "firebase/storage";
import { getFirebaseApp } from "./firebase-app";

let firestore: Firestore | undefined;
let firebaseStorage: FirebaseStorage | undefined;

export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp());
  }
  return firestore;
}

/** სურათების ატვირთვისთვის — გამოიყენე კომპონენტებიდან როცა დაგჭირდება */
export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    firebaseStorage = getStorage(getFirebaseApp());
  }
  return firebaseStorage;
}
